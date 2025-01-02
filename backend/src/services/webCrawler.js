import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";

class BookingCrawler {
    constructor(options = {}) {
        this.baseDir = options.baseDir || "data";
        this.hotelDir = path.join(this.baseDir, "hotels");
        this.attractionDir = path.join(this.baseDir, "attractions");
        this.userAgents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
        ];
        this.startTime = null;
    }

    async createBrowser() {
        const browser = await puppeteer.launch(this.getBrowserConfig());
        const page = await browser.newPage();
        await this.setupPage(page);
        return { browser, page };
    }

    logProgress(message, includeTimestamp = true) {
        const timestamp = includeTimestamp
            ? `[${new Date().toLocaleTimeString()}] `
            : "";
        console.log(`${timestamp}${message}`);
    }

    logTimeElapsed() {
        if (this.startTime) {
            const elapsed = (Date.now() - this.startTime) / 1000 / 60;
            this.logProgress(
                `Time elapsed: ${elapsed.toFixed(2)} minutes`,
                false
            );
        }
    }

    async initialize() {
        this.startTime = Date.now();
        try {
            this.browser = await puppeteer.launch(this.getBrowserConfig());
            this.page = await this.browser.newPage();
            await this.setupPage();
            this.logProgress("Crawler initialized successfully");
        } catch (error) {
            console.error("Error during initialization:", error);
            throw error;
        }
    }

    getBrowserConfig() {
        return {
            headless: false,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--disable-gpu",
                "--window-size=1920,1080",
                "--disable-web-security",
                "--disable-features=IsolateOrigins,site-per-process",
            ],
            defaultViewport: null,
        };
    }

    async setupPage() {
        await this.page.setUserAgent(
            this.userAgents[Math.floor(Math.random() * this.userAgents.length)]
        );
        await this.page.setExtraHTTPHeaders({
            "Accept-Language": "en-US,en;q=0.9",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
        });
        await this.page.emulateTimezone("Asia/Ho_Chi_Minh");
        await this.page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, "webdriver", {
                get: () => undefined,
            });
        });
    }

    delay(time) {
        return new Promise((resolve) =>
            setTimeout(resolve, time + Math.random() * 2000)
        );
    }

    async navigateWithRetry(page, url, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                await page.goto(url, {
                    waitUntil: "domcontentloaded",
                    timeout: 30000,
                });
                return true;
            } catch (error) {
                console.log(
                    `Navigation attempt ${i + 1} failed:`,
                    error.message
                );
                if (i === maxRetries - 1) throw error;
                await this.delay(5000);
            }
        }
        return false;
    }

    async handleCookieConsent() {
        try {
            const cookieButton = await this.page.$(
                "#onetrust-accept-btn-handler"
            );
            if (cookieButton) {
                await cookieButton.click();
                await this.delay(1000);
            }
        } catch (error) {
            console.log("No cookie consent found or unable to handle");
        }
    }

    async findWorkingSelector(page, selectors) {
        for (const selector of selectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                return selector;
            } catch (error) {
                console.log(`Selector ${selector} not found, trying next...`);
            }
        }
        throw new Error("No valid selector found");
    }

    async extractHotelData(page, selector) {
        return page.evaluate((sel) => {
            const getTextContent = (element, selector) =>
                element.querySelector(selector)?.textContent?.trim() || "";

            return Array.from(document.querySelectorAll(sel))
                .map((card) => {
                    const url =
                        card.querySelector('a[data-testid="title-link"]')
                            ?.href || "";
                    return {
                        name: getTextContent(card, 'div[data-testid="title"]'),
                        price: getTextContent(
                            card,
                            'span[data-testid="price-and-discounted-price"]'
                        ),
                        rating: getTextContent(
                            card,
                            'div[data-testid="review-score"] div.ac4a7896c7'
                        ),
                        numberOfReviews: getTextContent(
                            card,
                            'div[data-testid="review-score"] div.abf093bdfe'
                        ),
                        url,
                    };
                })
                .filter((hotel) => hotel.name && hotel.url);
        }, selector);
    }

    async extractHotelDetails(page) {
        return page.evaluate(() => {
            const getTextContent = (selector) =>
                document.querySelector(selector)?.textContent?.trim() || "";

            const extractFacilities = () =>
                Array.from(document.querySelectorAll("div.bd948ef1e2")).map(
                    (group) => ({
                        groupTitle: group
                            .querySelector("div.e1eebb6a1e")
                            ?.textContent?.trim(),
                        items: Array.from(group.querySelectorAll("ul > li"))
                            .map((item) =>
                                item
                                    .querySelector("span.a5a5a75131")
                                    ?.textContent?.trim()
                            )
                            .filter(Boolean),
                    })
                );

            const extractRoomDetails = () =>
                Array.from(document.querySelectorAll(".hprt-table tr"))
                    .map((row) => {
                        const type = row
                            .querySelector(".hprt-roomtype-icon-link")
                            ?.textContent?.trim();
                        const maxPerson = row
                            .querySelector(
                                ".hprt-occupancy-occupancy-info .bui-u-sr-only"
                            )
                            ?.textContent?.trim();
                        return type && maxPerson
                            ? `Room Type: ${type}, ${maxPerson}`
                            : null;
                    })
                    .filter(Boolean);
            const rulesSections = document.querySelectorAll("div.a26e4f0adb");
            const addressElement = document.querySelector("div.a53cbfa6de.f17adf7576");
            const address = addressElement ? 
                addressElement.childNodes[0].textContent.trim() : "";
            return {
                address: address,
                description: getTextContent(
                    '[data-testid="property-description"]'
                ),
                popularFacilities: Array.from(
                    document.querySelectorAll(
                        'div[data-testid="property-most-popular-facilities-wrapper"] ul > li span.a5a5a75131'
                    )
                )
                    .map((el) => el.textContent.trim())
                    .join(", "),
                houseRules: Array.from(rulesSections)
                    .map((section) => {
                        const title = section
                            .querySelector("div.e1eebb6a1e")
                            ?.textContent.trim();
                        const description = section
                            .querySelector("div.a53cbfa6de")
                            ?.textContent.trim();
                        return `${title}: ${description}`;
                    })
                    .join("\n"),
                allFacilities: extractFacilities(),
                roomDetailsList: extractRoomDetails(),
            };
        });
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
            const showMoreButtons = document.querySelectorAll('button.a83ed08757.f88a5204c2.b98133fb50');
            for (const button of showMoreButtons) {
                if (button.textContent.includes('Show')) {
                    await button.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        });

        await this.delay(2000);
        return page.evaluate(() => {
            // const extractItinerary = () => {
            //     const selectors = [
            //         '.css-cx2ej0',
            //         '.css-dba25'
            //     ];

            //     let allStops = null;

            //     for (const selector of selectors) {
            //         const elements = document.querySelectorAll(selector);
            //         if (elements && elements.length > 0) {
            //             allStops = elements;
            //             break;
            //         }
            //     }

            //     if (!allStops || allStops.length === 0) {
            //         return [];
            //     }
    
            //     const itineraryItems = [];

            //     allStops.forEach(stop => {
            //         const nameContainer = stop.querySelector('.css-yzcb9u div:first-child');
            //         const stopName = nameContainer.querySelector('span.e1eebb6a1e')?.textContent?.trim();
    
            //         const durationElement = stop.querySelector('.css-uirwny .a53cbfa6de');
            //         const duration = durationElement.textContent.trim();
    
            //         const descriptionElement = stop.querySelector('div.bcdcb105b3.fd0c3f4521');
            //         const description = descriptionElement.textContent.trim();
                    
            //         itineraryItems.push({
            //             name: stopName,
            //             duration,
            //             description,
            //         });
            //     });
            //     return itineraryItems;
            // };

            const extractDeparturePoint = () => {
                const departureContainer = document.querySelector('.f660aace8b.f81ab4937d');
                if (!departureContainer) return null;
            
                const addressDiv = departureContainer.querySelectorAll('.f660aace8b')[1];
                return addressDiv?.textContent?.trim() || "";
            };

            const duration = document.querySelector('.css-skmqk5 .e1eebb6a1e')?.textContent?.trim() || "";

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

                const included = Array.from(document.querySelectorAll('.bcdcb105b3.f660aace8b h2'))
                .filter(h2 => h2.textContent.includes("What's included"))
                .flatMap(h2 => {
                    const ul = h2.nextElementSibling;
                    return ul ? Array.from(ul.querySelectorAll('li .a466af8d48')).map(item => item.textContent.trim()) : [];
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
            // itinerary: extractItinerary(),
            departurePoint: extractDeparturePoint()
            };
        });
    }

    async crawlParallel(location, checkIn, checkOut) {
        this.startTime = Date.now();
        await this.ensureDataDirectory();
        const [city, countryCode, country] = location.split("-");

        const { browser: hotelBrowser, page: hotelPage } =
            await this.createBrowser();
        const { browser: attractionBrowser, page: attractionPage } =
            await this.createBrowser();

        try {
            this.logProgress(
                "Starting parallel crawl for hotels and attractions"
            );

            const [hotels, attractions] = await Promise.all([
                this.crawlHotelsWithPage(
                    hotelPage,
                    `${city}-${country}`,
                    checkIn,
                    checkOut
                ),
                this.crawlAttractionsWithPage(
                    attractionPage,
                    `${city}-${countryCode}`
                ),
            ]);

            await Promise.all([
                this.saveToCSV(hotels, `${city}_hotels.csv`, "hotel"),
                this.saveToCSV(attractions, `${city}_attractions.csv`, "attraction"),
            ]);

            this.logProgress("Completed parallel crawl");
            this.logTimeElapsed();

            return { hotels, attractions };
        } finally {
            await hotelBrowser.close();
            await attractionBrowser.close();
        }
    }

    async crawlHotelsWithPage(page, location, checkIn, checkOut) {
        this.logProgress(`Starting hotel crawl for ${location}`);
        const url = "https://www.booking.com/searchresults.en-gb.html?ss=Da+Lat%2C+Vietnam&ssne=Nha+Trang&ssne_untouched=Nha+Trang&efdco=1&label=gen173nr-1FCAEoggI46AdIM1gEaPQBiAEBmAEJuAEZyAEM2AEB6AEB-AEMiAIBqAIDuALiiZ-7BsACAdICJDRlMGRhNWQ3LTY5MDctNDkxNi1iOTI5LWIzNWM4YWYxZDY3Y9gCBuACAQ&sid=a00d49f16300ccfe35bc183f5c991edb&aid=304142&lang=en-gb&sb=1&src_elem=sb&src=index&dest_id=-3712045&dest_type=city&checkin=2025-01-02&checkout=2025-01-03&group_adults=2&no_rooms=1&group_children=0";

        await this.navigateWithRetry(page, url);
        await this.delay(2000);
        await this.handleCookieConsent(page);
        await this.loadAllResults(page);

        const selector = await this.findWorkingSelector(page, [
            'div[data-testid="property-card"]',
        ]);

        await this.autoScroll(page);
        const hotels = await this.extractHotelData(page, selector);

        const detailedHotels = [];
        for (let i = 0; i < hotels.length; i++) {
            const hotel = hotels[i];
            this.logProgress(
                `Processing hotel ${i + 1}/${hotels.length}: ${hotel.name}`
            );
            await this.navigateWithRetry(page, hotel.url);
            await this.delay(2000);
            const details = await this.extractHotelDetails(page);
            detailedHotels.push({ ...hotel, ...details });
        }

        return detailedHotels;
    }

    async crawlAttractionsWithPage(page, location) {
        const [city, countryCode, country] = location.split("-");
        const formattedCity = city.replace(/-/g, "").toLowerCase();
        this.logProgress(`Starting attraction crawl for ${city}`);
        const url = `https://www.booking.com/attractions/searchresults/${countryCode}/${formattedCity}.html`;

        await this.navigateWithRetry(page, url);
        await this.delay(2000);
        await this.handleCookieConsent(page);
        await this.loadAllResults(page);

        const selector = await this.findWorkingSelector(page, [
            'div[data-testid="card"]',
        ]);

        await this.autoScroll(page);
        const attractions = await this.extractAttractionData(page, selector);

        const detailedAttractions = [];
        for (let i = 0; i < attractions.length; i++) {
            const attraction = attractions[i];
            this.logProgress(
                `Processing attraction ${i + 1}/${attractions.length}: ${
                    attraction.name
                }`
            );
            await this.navigateWithRetry(page, attraction.url);
            await this.delay(2000);
            const details = await this.extractAttractionDetails(page);
            detailedAttractions.push({ ...attraction, ...details });
        }

        return detailedAttractions;
    }

    async loadAllResults(page) {
        this.logProgress("Starting to load all results...");
        let previousHeight = 0;
        let loadMoreAttempts = 0;
        const maxAttempts = 50;
    
        while (loadMoreAttempts < maxAttempts) {
            try {
                await this.autoScroll(page);
                await this.delay(1000);
    
                const loadMoreButton = await page.waitForSelector(
                    "button.a83ed08757.c21c56c305.bf0537ecb5.f671049264",
                    { timeout: 4000 }
                );
    
                if (!loadMoreButton) {
                    const alternativeButton = await page.$(
                        "button.a83ed08757.c21c56c305.bf0537ecb5.f671049264"
                    );
    
                    if (!alternativeButton) {
                        this.logProgress("No more results to load");
                        break;
                    }
                }
    
                await page.evaluate(() => {
                    const button = document.querySelector(
                        "button.a83ed08757.c21c56c305.bf0537ecb5.f671049264"
                    );
                    if (button) {
                        button.click();
                    }
                });
    
                await this.delay(2000);
    
                const currentHeight = await page.evaluate(
                    () => document.body.scrollHeight
                );
    
                if (currentHeight === previousHeight) {
                    loadMoreAttempts++;
                    if (loadMoreAttempts >= 3) {
                        this.logProgress(
                            "No new content loaded after 3 attempts, stopping"
                        );
                        break;
                    }
                } else {
                    loadMoreAttempts = 0;
                    previousHeight = currentHeight;
                }
            } catch (error) {
                console.log("Error while loading more results:", error.message);
                loadMoreAttempts++;
                if (loadMoreAttempts >= 3) {
                    this.logProgress(
                        "Failed to load more results after 3 attempts, stopping"
                    );
                    break;
                }
                await this.delay(2000);
            }
        }
        this.logProgress("Finished loading all results");
    }

    async autoScroll(page) {
        await page.evaluate(() => {
            return new Promise((resolve) => {
                const distance = 100;
                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    if (
                        window.innerHeight + window.pageYOffset >=
                        document.body.scrollHeight
                    ) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

    async ensureDataDirectory() {
        await fs.mkdir(this.hotelDir, { recursive: true });
        await fs.mkdir(this.attractionDir, { recursive: true });
        await fs.mkdir(path.join(this.hotelDir, "images"), { recursive: true });
        await fs.mkdir(path.join(this.attractionDir, "images"), {
            recursive: true,
        });
    }

    async readExistingCSV(filename, type) {
        try {
            const dir = type === "hotel" ? this.hotelDir : this.attractionDir;
            const filePath = path.join(dir, filename);
            const content = await fs.readFile(filePath, "utf-8");
            return parse(content, {
                columns: true,
                skip_empty_lines: true,
            });
        } catch (error) {
            console.log(
                `No existing ${type} file found or error reading file:`,
                error.message
            );
            return [];
        }
    }

    async mergeAndUpdateData(newData, existingData) {
        const merged = [...existingData];
        const urlMap = new Map(existingData.map((item) => [item.URL, item]));

        for (const newItem of newData) {
            if (urlMap.has(newItem.URL)) {
                const index = merged.findIndex(
                    (item) => item.URL === newItem.URL
                );
                merged[index] = {
                    ...merged[index],
                    ...newItem,
                    LastUpdated: new Date().toISOString(),
                };
            } else {
                merged.push({
                    ...newItem,
                    FirstAdded: new Date().toISOString(),
                    LastUpdated: new Date().toISOString(),
                });
            }
        }

        return merged;
    }

    async saveToCSV(data, filename, type) {
        try {
            this.logProgress(`Preparing to save ${type} data...`);
            const dir = type === "hotel" ? this.hotelDir : this.attractionDir;
            const filePath = path.join(dir, filename);

            this.logProgress(`Reading existing ${type} data (if any)...`);
            const existingData = await this.readExistingCSV(filename, type);

            this.logProgress(`Merging new ${type} data with existing data...`);
            const mergedData = await this.mergeAndUpdateData(
                data,
                existingData
            );

            const flattenedData =
                type === "hotel"
                    ? this.flattenHotelData(mergedData)
                    : this.flattenAttractionData(mergedData);

            await fs.writeFile(
                filePath,
                stringify(flattenedData, {
                    header: true,
                    columns: Object.keys(flattenedData[0]),
                })
            );

            const imagesDir = path.join(dir, "images");
            if (type === "attraction") {
                await this.saveAttractionImages(data, imagesDir);
            }

            console.log(`${type} data saved to: ${filePath}`);
            console.log(`Total ${type} records: ${mergedData.length}`);
        } catch (error) {
            console.error(`Error saving ${type} data:`, error);
            throw error;
        }
    }

    async createBackup(filename, type) {
        try {
            const dir = type === "hotel" ? this.hotelDir : this.attractionDir;
            const filePath = path.join(dir, filename);
            const backupPath = path.join(
                dir,
                `backup_${filename}_${Date.now()}.csv`
            );

            try {
                await fs.access(filePath);
                await fs.copyFile(filePath, backupPath);
                console.log(`${type} backup created: ${backupPath}`);
            } catch (error) {
                console.log(`No existing ${type} file to backup`);
            }
        } catch (error) {
            console.error(`Error creating ${type} backup:`, error);
        }
    }

    flattenHotelData(hotels) {
        return hotels.map((hotel) => ({
            Name: hotel.name,
            Price: hotel.price,
            Rating: hotel.rating,
            Address: hotel.address,
            "No. review": hotel.numberOfReviews,
            "Popular Facilities": hotel.popularFacilities,
            "All Facilities": hotel.allFacilities
                ?.map(
                    (group) => `${group.groupTitle}: ${group.items.join(", ")}`
                )
                .join("\n"),
            "Room Details": hotel.roomDetailsList?.join("\n"),
            "Hotel Rules": hotel.houseRules,
            Description: hotel.description,
            URL: hotel.url,
            FirstAdded: hotel.FirstAdded,
            LastUpdated: hotel.LastUpdated,
        }));
    }

    flattenAttractionData(attractions) {
        return attractions.map((attraction) => ({
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
            // "Itinerary": attraction.itinerary ? 
            // attraction.itinerary.map(stop => 
            //     `Stop: ${stop.name}\nDuration: ${stop.duration}\nDescription: ${stop.description}}`
            // ).join("\n\n") : "",
            "Departure Point": attraction.departurePoint,
            Ticket: this.formatTickets(attraction.tickets),
            Images: attraction.images?.map((img) => img.url).join(", "),
            URL: attraction.url,
            FirstAdded: attraction.FirstAdded,
            LastUpdated: attraction.LastUpdated,
        }));
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

    async saveAttractionImages(attractions, imagesDir) {
        for (const attraction of attractions) {
            if (attraction.images && attraction.images.length > 0) {
                const attractionFolderName = attraction.name
                    .replace(/[^a-z0-9]/gi, "_")
                    .toLowerCase()
                    .replace(/_+/g, "_")
                    .replace(/^_|_$/g, "");

                const attractionDir = path.join(
                    imagesDir,
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

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

const runParallelCrawler = async () => {
    const crawler = new BookingCrawler({
        baseDir: "../data",
    });

    await crawler.initialize();

    try {
        const location = "dalat-vn-vietnam";
        const checkIn = "2024-01-02";
        const checkOut = "2024-01-03";

        const results = await crawler.crawlParallel(
            location,
            checkIn,
            checkOut
        );
        console.log(
            `Crawled ${results.hotels.length} hotels and ${results.attractions.length} attractions`
        );
    } catch (error) {
        console.error("Error during parallel crawl:", error);
    } finally {
        await crawler.close();
    }
};

runParallelCrawler();
export default BookingCrawler;
