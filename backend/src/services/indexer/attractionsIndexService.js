// attractionsIndexing.js
import elasticClient from "../../config/elasticDb.js";
import { generateEmbeddings } from "../embeddingService.js";
import DocumentLoader from "../documentLoader.js";

const BATCH_SIZE = 100;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Utility functions
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
const formatRating = (ratingStr) => {
    if (!ratingStr) return null;
    const match = ratingStr.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
};

const formatReviewCount = (reviewStr) => {
    if (!reviewStr) return null;
    const match = reviewStr.match(/\d+/);
    return match ? parseInt(match[0]) : null;
};

const formatInclusions = (includedStr) => {
    if (!includedStr) return [];
    return includedStr
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
};

const formatTickets = (ticketStr) => {
    if (!ticketStr) return [];
    return ticketStr.split("\n").map((ticket) => {
        const [typeInfo, priceInfo] = ticket
            .split("|")
            .map((part) => part.trim());
        const type = typeInfo.replace("Type:", "").trim();
        const price = priceInfo.replace("Price:", "").trim();
        return { type, price };
    });
};

const formatImages = (imagesStr) => {
    if (!imagesStr) return [];
    return imagesStr.split(",").map((url) => url.trim());
};

const formatItinerary = (itineraryStr) => {
    if (!itineraryStr) return { totalDuration: null, stops: [] };

    const stops = [];
    let totalDuration = null;

    const lines = itineraryStr.split("\n\n");

    lines.forEach((section) => {
        if (section.startsWith("Stop")) {
            const [title, ...details] = section.split("\n");
            const stop = {
                title: title.split(":")[0].trim(),
                description:
                    details
                        .find((d) => d.startsWith("Description:"))
                        ?.replace("Description:", "")
                        .trim() || null,
                admission:
                    details
                        .find((d) => d.startsWith("Admission:"))
                        ?.replace("Admission:", "")
                        .trim() || null,
            };
            stops.push(stop);
        }
    });

    return { totalDuration, stops };
};

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

async function shouldUpdateAttraction(attractionId, lastUpdated) {
    try {
        const exists = await elasticClient.exists({
            index: "attractions",
            id: attractionId,
        });

        if (!exists) return true;

        const result = await elasticClient.get({
            index: "attractions",
            id: attractionId,
        });

        const existingLastUpdated = result._source.metadata.lastUpdated;
        return new Date(lastUpdated) > new Date(existingLastUpdated);
    } catch (error) {
        console.error(`Error checking hotel ${hotelId}:`, error);
        return false;
    }
}

const createIndexWithMapping = async () => {
    const indexExists = await elasticClient.indices.exists({
        index: "attractions",
    });

    if (!indexExists) {
        await elasticClient.indices.create({
            index: "attractions",
            body: {
                mappings: {
                    properties: {
                        embedding: { type: "dense_vector", dims: 768 },
                        pageContent: { type: "text" },
                        metadata: {
                            properties: {
                                name: { type: "text" },
                                rating: { type: "float" },
                                reviewCount: { type: "integer" },
                                description: { type: "text" },
                                inclusions: { type: "keyword" },
                                cancellationPolicy: { type: "text" },
                                additionalInfo: { type: "text" },
                                whatToKnow: { type: "text" },
                                location: { type: "text" },
                                duration: { type: "text" },
                                departurePoint: { type: "text" },
                                itinerary: {
                                    properties: {
                                        totalDuration: { type: "text" },
                                        stops: {
                                            properties: {
                                                title: { type: "text" },
                                                duration: { type: "text" },
                                                description: { type: "text" },
                                                admission: { type: "text" },
                                            },
                                        },
                                    },
                                },
                                tickets: {
                                    properties: {
                                        type: { type: "keyword" },
                                        price: { type: "text" },
                                    },
                                },
                                images: { type: "keyword" },
                                url: { type: "keyword" },
                                firstAdded: { type: "date" },
                                lastUpdated: { type: "date" },
                            },
                        },
                    },
                },
            },
        });
        console.log("Created new attractions index with mapping");
    }
};

// Core indexing function
export const indexAttractions = async (filePath, options = {}) => {
    const {
        skipExisting = false,
        batchSize = BATCH_SIZE,
        updateExisting = true,
    } = options;

    try {
        // Ensure index exists
        await createIndexWithMapping();

        const loader = new DocumentLoader();
        const documents = await loader.loadDocuments(filePath);

        for (let i = 0; i < documents.length; i += batchSize) {
            const batch = documents.slice(i, i + batchSize);
            const normalizedBatch = await Promise.all(
                batch.map(async (doc) => {
                    try {
                        const attraction = JSON.parse(doc.text);
                        if (!attraction || typeof attraction !== "object") {
                            console.error(
                                "Invalid attraction object:",
                                attraction
                            );
                            return null;
                        }

                        const attractionId = attraction.Name.replace(
                            /\s+/g,
                            "_"
                        );

                        // Skip/update check logic (similar to hotels)
                        if (skipExisting || updateExisting) {
                            const shouldUpdate = await shouldUpdateAttraction(
                                attractionId,
                                attraction.LastUpdated
                            );
                            if (!shouldUpdate) {
                                console.log(
                                    `Skipping attraction ${attractionId} - no updates needed`
                                );
                                return null;
                            }
                        }

                        return {
                            id: attractionId,
                            data: {
                                name: attraction.Name,
                                rating: formatRating(attraction.Rating),
                                reviewCount: formatReviewCount(
                                    attraction["No. Reviews"]
                                ),
                                description: attraction.Description,
                                inclusions: formatInclusions(
                                    attraction["What's Included"]
                                ),
                                cancellationPolicy:
                                    attraction["Cancellation Policy"],
                                additionalInfo: attraction["Additional Info"],
                                whatToKnow: attraction["What to Know"],
                                location: attraction.Location,
                                duration: attraction.Duration,
                                departurePoint: attraction["Departure Point"],
                                itinerary: formatItinerary(
                                    attraction.Itinerary
                                ),
                                tickets: formatTickets(attraction.Ticket),
                                images: formatImages(attraction.Images),
                                url: attraction.URL,
                                firstAdded:
                                    attraction.FirstAdded ||
                                    new Date().toISOString(),
                                lastUpdated:
                                    attraction.LastUpdated ||
                                    new Date().toISOString(),
                            },
                        };
                    } catch (error) {
                        console.error("Error parsing attraction:", error);
                        return null;
                    }
                })
            );

            const validAttractions = normalizedBatch.filter(
                (attr) => attr !== null
            );
            const texts = validAttractions.map((attr) => {
                const { data } = attr;
                const parts = [
                    data.name,
                    data.description,
                    `Located at ${data.location}`,
                    data.duration && `Duration: ${data.duration}`,
                    data.inclusions.length &&
                        `Includes: ${data.inclusions.join(", ")}`,
                    data.whatToKnow,
                ];
                return parts.filter(Boolean).join(". ");
            });

            const embeddings = await generateEmbeddings(texts);

            const operations = validAttractions.flatMap((attr, index) => [
                { index: { _index: "attractions", _id: attr.id } },
                {
                    embedding: embeddings[index],
                    pageContent: texts[index],
                    metadata: attr.data,
                },
            ]);

            if (operations.length > 0) {
                await processBulkOperations(operations);
                console.log(
                    `Processed batch of ${validAttractions.length} attractions`
                );
            }
        }

        await elasticClient.indices.refresh({ index: "attractions" });
        console.log("All attractions have been indexed successfully.");
    } catch (error) {
        console.error("Error processing attractions:", error);
        throw error;
    }
};
