import elasticClient from "../../config/elasticDb.js";
import { generateEmbeddings } from "../embeddingService.js";
import DocumentLoader from "../documentLoader.js";

const BATCH_SIZE = 100;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const formatPrice = (priceStr) => {
    if (!priceStr) return null;
    const number = priceStr.replace(/[^0-9]/g, "");
    return parseInt(number, 10);
};

const formatRating = (ratingStr) => {
    if (!ratingStr) return null;
    const match = ratingStr.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
};

const formatFacilities = (popularFacilities, allFacilities) => {
    const popular = popularFacilities
        ? [...new Set(popularFacilities.split(", "))]
        : [];

    const all = {};
    if (allFacilities) {
        allFacilities.split("\n").forEach((facility) => {
            const [category, items] = facility.split(": ");
            if (category && items) {
                all[category.trim()] = items
                    .split(", ")
                    .map((item) => item.trim());
            }
        });
    }

    return {
        popular_facilities: popular,
        all_facilities: Object.entries(all).map(([category, items]) => ({
            category,
            items,
        })),
    };
};

const formatRoomDetails = (roomDetails) => {
    if (!roomDetails) return [];

    return roomDetails
        .split("\n")
        .map((room) => {
            try {
                const [typeInfo, capacityInfo] = room.split(", ");
                return {
                    type: typeInfo?.replace("Room Type: ", "").trim() || null,
                    max_persons: capacityInfo
                        ? parseInt(capacityInfo.split(": ")[1]) || null
                        : null,
                };
            } catch (error) {
                console.error("Error parsing room details:", room);
                return null;
            }
        })
        .filter((room) => room !== null);
};

const formatReviewCount = (reviewStr) => {
    if (!reviewStr) return null;
    const match = reviewStr.match(/\d+/);
    return match ? parseInt(match[0]) : null;
};

// Core functions
async function withRetry(fn, retries = MAX_RETRIES) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            await sleep(RETRY_DELAY * Math.pow(2, i));
        }
    }
}

const createIndexWithMapping = async () => {
    const indexExists = await elasticClient.indices.exists({ index: "hotels" });

    if (!indexExists) {
        await elasticClient.indices.create({
            index: "hotels",
            body: {
                mappings: {
                    properties: {
                        embedding: { type: "dense_vector", dims: 768 },
                        pageContent: { type: "text" },
                        metadata: {
                            properties: {
                                name: { type: "text" },
                                address: { type: "text" },
                                price: { type: "integer" },
                                rating: { type: "float" },
                                reviewCount: { type: "integer" },
                                facilities: {
                                    properties: {
                                        popular_facilities: { type: "keyword" },
                                        all_facilities: {
                                            properties: {
                                                category: { type: "keyword" },
                                                items: { type: "keyword" },
                                            },
                                        },
                                    },
                                },
                                roomTypes: {
                                    properties: {
                                        type: { type: "keyword" },
                                        max_persons: { type: "integer" },
                                    },
                                },
                                rules: {
                                    properties: {
                                        checkIn: { type: "keyword" },
                                        checkOut: { type: "keyword" },
                                        petsAllowed: { type: "boolean" },
                                        paymentMethods: { type: "keyword" },
                                    },
                                },
                                languages: { type: "keyword" },
                                url: { type: "keyword" },
                                firstAdded: { type: "date" },
                                lastUpdated: { type: "date" },
                            },
                        },
                    },
                },
            },
        });
        console.log("Created new hotels index with mapping");
    } else {
        console.log("Hotels index already exists, skipping creation");
    }
};

async function shouldUpdateHotel(hotelId, lastUpdated) {
    try {
        const exists = await elasticClient.exists({
            index: "hotels",
            id: hotelId,
        });

        if (!exists) return true;

        const result = await elasticClient.get({
            index: "hotels",
            id: hotelId,
        });

        const existingLastUpdated = result._source.metadata.lastUpdated;
        return new Date(lastUpdated) > new Date(existingLastUpdated);
    } catch (error) {
        console.error(`Error checking hotel ${hotelId}:`, error);
        return false;
    }
}

// Xử lý bulk operations với retry logic
async function processBulkOperations(operations) {
    return await withRetry(async () => {
        const bulkResponse = await elasticClient.bulk({
            refresh: true,
            operations,
        });

        if (bulkResponse.errors) {
            const erroredDocuments = [];
            bulkResponse.items.forEach((action, i) => {
                const operation = Object.keys(action)[0];
                if (action[operation].error) {
                    erroredDocuments.push({
                        status: action[operation].status,
                        error: action[operation].error,
                        operation: operations[i * 2 + 1],
                    });
                }
            });
            console.error("Failed documents:", erroredDocuments);
            throw new Error("Bulk operation failed");
        }

        return bulkResponse;
    });
}

// Hàm chính để index documents
const indexDocuments = async (filePath, options = {}) => {
    const {
        skipExisting = false,
        batchSize = BATCH_SIZE,
        updateExisting = true,
    } = options;

    try {
        // Tạo index nếu chưa tồn tại
        const indexExists = await elasticClient.indices.exists({
            index: "hotels",
        });
        if (!indexExists) {
            await createIndexWithMapping();
        }

        // Load và normalize dữ liệu
        const loader = new DocumentLoader();
        const documents = await loader.loadDocuments(filePath);

        // Xử lý theo batches
        for (let i = 0; i < documents.length; i += batchSize) {
            const batch = documents.slice(i, i + batchSize);
            const normalizedBatch = await Promise.all(
                batch.map(async (doc) => {
                    try {
                        const hotel = JSON.parse(doc.text);
                        if (!hotel || typeof hotel !== "object") {
                            console.error("Invalid hotel object:", hotel);
                            return null;
                        }

                        const hotelId = hotel.Name.replace(/\s+/g, "_");

                        // Kiểm tra xem có nên skip/update document này không
                        if (skipExisting || updateExisting) {
                            const shouldUpdate = await shouldUpdateHotel(
                                hotelId,
                                hotel.LastUpdated
                            );
                            if (!shouldUpdate) {
                                console.log(
                                    `Skipping hotel ${hotelId} - no updates needed`
                                );
                                return null;
                            }
                        }

                        return {
                            id: hotelId,
                            data: {
                                name: hotel.Name || "Unknown Hotel",
                                price: formatPrice(hotel.Price),
                                rating: formatRating(hotel.Rating),
                                address: hotel.Address || null,
                                reviewCount: formatReviewCount(
                                    hotel["No. review"]
                                ),
                                facilities: formatFacilities(
                                    hotel["Popular Facilities"],
                                    hotel["All Facilities"]
                                ),
                                roomTypes: formatRoomDetails(
                                    hotel["Room Details"]
                                ),
                                rules: {
                                    checkIn:
                                        hotel["Hotel Rules"]?.match(
                                            /Check-in: (.*)/
                                        )?.[1] || null,
                                    checkOut:
                                        hotel["Hotel Rules"]?.match(
                                            /Check-out: (.*)/
                                        )?.[1] || null,
                                    petsAllowed: hotel["Hotel Rules"]
                                        ? !hotel["Hotel Rules"].includes(
                                              "Pets are not allowed"
                                          )
                                        : null,
                                    paymentMethods: hotel["Hotel Rules"]
                                        ? hotel["Hotel Rules"].includes(
                                              "Cash only"
                                          )
                                            ? ["cash"]
                                            : ["cash", "card"]
                                        : ["cash", "card"],
                                },
                                description: hotel.Description || null,
                                languages: hotel["Languages spoken"]
                                    ? hotel["Languages spoken"].split(", ")
                                    : [],
                                url: hotel.URL || null,
                                firstAdded:
                                    hotel.FirstAdded ||
                                    new Date().toISOString(),
                                lastUpdated:
                                    hotel.LastUpdated ||
                                    new Date().toISOString(),
                            },
                        };
                    } catch (error) {
                        console.error("Error parsing document:", error);
                        return null;
                    }
                })
            );

            // Filter out null values and prepare texts for embedding
            const validHotels = normalizedBatch.filter(
                (hotel) => hotel !== null
            );
            const texts = validHotels.map((hotel) => {
                const { data } = hotel;
                const parts = [
                    data.name,
                    data.address && `Located at ${data.address}`,
                    data.price && `Price: ${data.price} VND`,
                    data.rating && `Rating: ${data.rating}/10`,
                    data.reviewCount && `${data.reviewCount} reviews`,
                    data.facilities.popular_facilities.length &&
                        `Popular facilities include: ${data.facilities.popular_facilities.join(
                            ", "
                        )}`,
                    data.description,
                ];
                return parts.filter(Boolean).join(". ");
            });

            // Generate embeddings for the batch
            const embeddings = await generateEmbeddings(texts);

            // Prepare bulk operations
            const operations = validHotels.flatMap((hotel, index) => [
                { index: { _index: "hotels", _id: hotel.id } },
                {
                    embedding: embeddings[index],
                    pageContent: texts[index],
                    metadata: hotel.data,
                },
            ]);

            if (operations.length > 0) {
                // Process bulk operations with retry logic
                await processBulkOperations(operations);
                console.log(`Processed batch of ${validHotels.length} hotels`);
            }
        }

        // Refresh index
        await elasticClient.indices.refresh({ index: "hotels" });
        console.log("All documents have been indexed successfully.");
    } catch (error) {
        console.error("Error processing documents:", error);
        throw error;
    }
};

export { indexDocuments, createIndexWithMapping };
