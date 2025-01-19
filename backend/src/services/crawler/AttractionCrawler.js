import path from "path";
import { promises as fs } from "fs";
import BaseCrawler from "./baseCrawler.js";

class AttractionCrawler extends BaseCrawler {
    constructor(options = {}) {
        super(options);
        this.attractionDir = path.join(this.baseDir, "attractions");
        this.flattenAttractionData = this.flattenAttractionData.bind(this);
        this.formatTickets = this.formatTickets.bind(this);
    }

    async initialize() {
        await super.initialize();
        await fs.mkdir(this.attractionDir, { recursive: true });
    }

    async extractAttractionData(page, selector) {
        return page.evaluate((sel) => {
            const getTextContent = (element, selector) =>
                element.querySelector(selector)?.textContent?.trim() || "";

            return Array.from(document.querySelectorAll(sel))
                .map((card) => {
                    const url =
                        card.querySelector('h3[data-testid="card-title"] a')
                            ?.href || "";

                    const reviewScoreDiv = card.querySelector(
                        'div[data-testid="review-score"]'
                    );

                    const rating =
                        reviewScoreDiv
                            ?.querySelector(".css-35ezg3")
                            ?.textContent?.trim() || "";

                    const reviewText =
                        reviewScoreDiv
                            ?.querySelector(".a53cbfa6de:last-child")
                            ?.textContent?.trim() || "";
                    const numberOfReviews =
                        reviewText.match(/\((\d+)\s+reviews\)/)?.[1] || "";

                    return {
                        name: getTextContent(
                            card,
                            '[data-testid="card-title"]'
                        ),
                        rating: rating,
                        numberOfReviews: numberOfReviews,
                        url,
                    };
                })
                .filter((attraction) => attraction.name && attraction.url);
        }, selector);
    }

    async extractAttractionDetails(page) {
        await page.evaluate(async () => {
            const waitAfterClick = () =>
                new Promise((resolve) => setTimeout(resolve, 1000));
            const showMoreButtons = document.querySelectorAll(
                "button.a83ed08757.f88a5204c2.b98133fb50"
            );
            for (const button of showMoreButtons) {
                if (button.textContent.includes("Show")) {
                    await button.click();
                    await waitAfterClick();
                }
            }
            const showAllStopsButton = Array.from(
                document.querySelectorAll(
                    "button.a83ed08757.f88a5204c2.b98133fb50"
                )
            ).find(
                (button) =>
                    button.textContent.includes("Show all") &&
                    button.textContent.includes("stops")
            );

            if (showAllStopsButton) {
                await showAllStopsButton.click();
                await waitAfterClick();
            }
        });

        await this.delay(2000);
        return page.evaluate(() => {
            const extractItinerary = () => {
                const itinerarySection = Array.from(
                    document.querySelectorAll("h3.f6431b446c.css-zwx81y")
                ).find((header) =>
                    header.textContent.includes("Itinerary information")
                );

                if (!itinerarySection) return null;

                const stops = Array.from(
                    document.querySelectorAll(".css-cx2ej0, .css-dba25")
                )
                    .map((stop) => {
                        const name = stop
                            .querySelector(".e1eebb6a1e")
                            ?.textContent?.trim();
                        const duration = stop
                            .querySelector(".a53cbfa6de")
                            ?.textContent?.trim();
                        const description = stop
                            .querySelector(".bcdcb105b3.fd0c3f4521")
                            ?.textContent?.trim();
                        const admission = stop
                            .querySelector(".a466af8d48")
                            ?.textContent?.trim();

                        return {
                            name,
                            duration,
                            description,
                            admission,
                        };
                    })
                    .filter((stop) => stop.name);

                const totalDuration = document
                    .querySelector(".a3332d346a")
                    ?.textContent?.trim();

                return {
                    totalDuration,
                    stops,
                };
            };

            const extractDeparturePoint = () => {
                const departureContainer = document.querySelector(
                    ".f660aace8b.f81ab4937d"
                );
                if (!departureContainer) return null;

                const addressDiv =
                    departureContainer.querySelectorAll(".f660aace8b")[1];
                return addressDiv?.textContent?.trim() || "";
            };

            const duration =
                document
                    .querySelector(".css-skmqk5 .e1eebb6a1e")
                    ?.textContent?.trim() || "";

            const images = Array.from(
                document.querySelectorAll('[data-testid^="gridImage-"] img')
            )
                .map((img) => ({
                    url: img.src,
                    alt: img.alt,
                }))
                .filter((img) => img.url);

            const description = Array.from(
                document.querySelectorAll(
                    'div[data-testid="attr-content"] .css-n9kgwt .bcdcb105b3'
                )
            )
                .map((p) => p.textContent.trim())
                .filter((text) => text.length > 0)
                .join("\n");

            const included = Array.from(
                document.querySelectorAll(".bcdcb105b3.f660aace8b h2")
            )
                .filter((h2) => h2.textContent.includes("What's included"))
                .flatMap((h2) => {
                    const ul = h2.nextElementSibling;
                    return ul
                        ? Array.from(ul.querySelectorAll("li .a466af8d48")).map(
                              (item) => item.textContent.trim()
                          )
                        : [];
                })
                .filter(Boolean);

            const cancellationContainer = document.querySelector(
                ".a3b8729ab1.d068504c75"
            );
            const cancellationDetails = document.querySelector(
                ".a53cbfa6de.f45d8e4c32"
            );
            const cancellationPolicy =
                cancellationContainer && cancellationDetails
                    ? `${cancellationContainer.textContent.trim()} - ${cancellationDetails.textContent.trim()}`
                    : "";

            const additionalInfo = Array.from(
                document.querySelectorAll("h3.f6431b446c.css-zwx81y")
            )
                .filter((header) =>
                    header.textContent.includes("Additional information")
                )
                .flatMap((header) => {
                    const infoDiv = header.nextElementSibling;
                    return infoDiv
                        ? Array.from(infoDiv.querySelectorAll(".bcdcb105b3"))
                              .map((p) => p.textContent.trim())
                              .filter(Boolean)
                        : [];
                })
                .join("\n");

            const whatToKnow = Array.from(
                document.querySelectorAll("h3.f6431b446c.css-zwx81y")
            )
                .filter((header) =>
                    header.textContent.includes("What you need to know")
                )
                .flatMap((header) => {
                    const infoDiv = header.nextElementSibling;
                    return infoDiv
                        ? Array.from(infoDiv.querySelectorAll(".bcdcb105b3"))
                              .map((p) => p.textContent.trim())
                              .filter(Boolean)
                        : [];
                })
                .join("\n");

            const location =
                document
                    .querySelector(".f660aace8b.f81ab4937d div:last-child")
                    ?.textContent.trim() || "";

            const tickets = Array.from(
                document.querySelectorAll(
                    '[data-testid="ticket-selector-stepper"]'
                )
            ).map((ticketElement) => {
                const label = ticketElement
                    .querySelector(".a984a491d9")
                    ?.textContent.trim();
                const currentPrice = ticketElement
                    .querySelector(".b76b1e28fc")
                    ?.textContent.trim();
                const originalPrice = ticketElement
                    .querySelector(".f2ce4336b0")
                    ?.textContent.trim();

                return {
                    type: label || "",
                    currentPrice: currentPrice || "",
                    originalPrice: originalPrice || "",
                };
            });

            return {
                description,
                included,
                cancellationPolicy,
                additionalInfo,
                whatToKnow,
                location,
                images,
                tickets,
                duration,
                departurePoint: extractDeparturePoint(),
                itinerary: extractItinerary(),
            };
        });
    }

    flattenAttractionData(attractions) {
        return attractions.map((attraction) => {
            const formatItinerary = (itinerary) => {
                if (!itinerary) return "";

                const stops = itinerary.stops
                    .map(
                        (stop, index) =>
                            `Stop ${index + 1}: ${stop.name}\n` +
                            `Duration: ${stop.duration}\n` +
                            `Description: ${stop.description}\n` +
                            `Admission: ${stop.admission}`
                    )
                    .join("\n\n");

                return `Total Duration: ${itinerary.totalDuration}\n\n${stops}`;
            };

            return {
                Name: attraction.name,
                Rating: attraction.rating,
                "No. Reviews": attraction.numberOfReviews,
                Description: attraction.description,
                "What's Included": attraction.included?.join("\n"),
                "Cancellation Policy": attraction.cancellationPolicy,
                "Additional Info": attraction.additionalInfo,
                "What to Know": attraction.whatToKnow,
                Location: attraction.location,
                Duration: attraction.duration,
                "Departure Point": attraction.departurePoint,
                Itinerary: formatItinerary(attraction.itinerary),
                Ticket: this.formatTickets(attraction.tickets),
                Images: attraction.images?.map((img) => img.url).join(", "),
                URL: attraction.url,
                FirstAdded: attraction.FirstAdded,
                LastUpdated: attraction.LastUpdated,
            };
        });
    }

    formatTickets(tickets) {
        if (!tickets || !Array.isArray(tickets)) return "";
        return tickets
            .map((ticket) => {
                const parts = [];
                parts.push(`Type: ${ticket.type}`);
                if (ticket.currentPrice)
                    parts.push(`Price: ${ticket.currentPrice}`);
                if (ticket.originalPrice)
                    parts.push(`Original: ${ticket.originalPrice}`);
                return parts.join(" | ");
            })
            .join("\n");
    }

    async saveAttractionImages(attractions, cityName) {
        const cityImagesDir = path.join(this.attractionDir, cityName, "images");
        await fs.mkdir(cityImagesDir, { recursive: true });

        for (const attraction of attractions) {
            if (attraction.images && attraction.images.length > 0) {
                const attractionFolderName = attraction.name
                    .replace(/[^a-z0-9]/gi, "_")
                    .toLowerCase()
                    .replace(/_+/g, "_")
                    .replace(/^_|_$/g, "");

                const attractionDir = path.join(
                    cityImagesDir,
                    attractionFolderName
                );
                await fs.mkdir(attractionDir, { recursive: true });

                for (let i = 0; i < attraction.images.length; i++) {
                    const imgUrl = attraction.images[i].url;
                    const imgPath = path.join(
                        attractionDir,
                        `image_${i + 1}.jpg`
                    );

                    try {
                        const response = await fetch(imgUrl);
                        if (!response.ok)
                            throw new Error(
                                `HTTP error! status: ${response.status}`
                            );

                        const fileStream = await fs.open(imgPath, "w");
                        const writer = fileStream.createWriteStream();

                        const arrayBuffer = await response.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);
                        writer.write(buffer);
                        writer.end();

                        await new Promise((resolve, reject) => {
                            writer.on("finish", resolve);
                            writer.on("error", reject);
                        });

                        await fileStream.close();

                        this.logProgress(
                            `Saved image ${i + 1}/${
                                attraction.images.length
                            } for ${attraction.name}`
                        );
                    } catch (error) {
                        console.error(
                            `Error downloading image ${i + 1} for ${
                                attraction.name
                            }:`,
                            error.message
                        );
                    }
                }
            }
        }
    }

    async crawlAttractions(urlList) {
        for (const item of urlList) {
            const { url, city } = item;

            this.logProgress(`Starting attraction crawl for ${city}`);

            const cityDir = path.join(
                this.attractionDir,
                city.replace(/[^a-z0-9]/gi, "-")
            );
            await fs.mkdir(cityDir, { recursive: true });

            await this.navigateWithRetry(this.page, url);
            await this.delay(2000);
            await this.handleCookieConsent();
            await this.loadAllResults(this.page, '[data-testid="card"]');

            const selector = await this.findWorkingSelector(this.page, [
                'div[data-testid="card"]',
            ]);

            await this.autoScroll(this.page);
            const attractions = await this.extractAttractionData(
                this.page,
                selector
            );

            const detailedAttractions = [];
            for (let i = 0; i < attractions.length; i++) {
                const attraction = attractions[i];
                this.logProgress(
                    `Processing attraction ${i + 1}/${attractions.length}: ${
                        attraction.name
                    }`
                );
                await this.navigateWithRetry(this.page, attraction.url);
                await this.delay(2000);
                const details = await this.extractAttractionDetails(this.page);
                detailedAttractions.push({ ...attraction, ...details });
            }

            const mergedData = await this.saveToCSV(
                detailedAttractions,
                `${city.replace(/[^a-z0-9]/gi, "-")}_attractions.csv`,
                path.join(this.attractionDir, city),
                this.flattenAttractionData
            );

            await this.saveAttractionImages(mergedData, city);
        }
    }
}

export default AttractionCrawler;
