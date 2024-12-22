import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";

class BookingCrawler {
    constructor(options = {}) {
        this.browser = null;
        this.page = null;
        this.dataDir = options.dataDir || "data";
        this.userAgents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
        ];
        this.startTime = null;
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

    async navigateWithRetry(url, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                await this.page.goto(url, {
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

    async findWorkingSelector(selectors) {
        for (const selector of selectors) {
            try {
                await this.page.waitForSelector(selector, { timeout: 5000 });
                return selector;
            } catch (error) {
                console.log(`Selector ${selector} not found, trying next...`);
            }
        }
        throw new Error("No valid hotel cards selector found");
    }

    async extractHotelData(selector) {
        return this.page.evaluate((sel) => {
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

    async extractHotelDetails() {
        return this.page.evaluate(() => {
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
            return {
                address: getTextContent("div.a53cbfa6de.f17adf7576"),
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

    async crawlHotels(city, checkIn, checkOut) {
        this.logProgress(
            `Starting crawl for ${city} (${checkIn} to ${checkOut})`
        );
        const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
            city
        )}&checkin=${checkIn}&checkout=${checkOut}&lang=en-us&selected_currency=USD`;

        await this.navigateWithRetry(url);
        await this.delay(2000);
        await this.handleCookieConsent();

        const selector = await this.findWorkingSelector([
            'div[data-testid="property-card"]',
            "div.a826ba81c4",
            "div.b978843432",
            'div[data-testid="accommodation-list-element"]',
            "div.property-card",
        ]);

        await this.autoScroll();
        const hotels = await this.extractHotelData(selector);
        this.logProgress(`Found ${hotels.length} hotels in total`);

        const detailedHotels = [];
        for (let i = 0; i < 3; i++) {
            const hotel = hotels[i];
            this.logProgress(
                `Processing hotel ${i + 1}/${hotels.length}: ${hotel.name}`
            );
            this.logProgress(
                `Progress: ${(((i + 1) / hotels.length) * 100).toFixed(1)}%`
            );

            await this.navigateWithRetry(hotel.url);
            await this.delay(2000);
            const details = await this.extractHotelDetails();
            detailedHotels.push({ ...hotel, ...details });
        }

        this.logProgress(`Completed crawling ${detailedHotels.length} hotels`);
        this.logTimeElapsed();
        return detailedHotels;
    }

    async autoScroll() {
        await this.page.evaluate(() => {
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
        try {
            await fs.access(this.dataDir);
        } catch {
            await fs.mkdir(this.dataDir, { recursive: true });
        }
    }

    async readExistingCSV(filename) {
        try {
            const filePath = path.join(this.dataDir, filename);
            const content = await fs.readFile(filePath, "utf-8");
            return parse(content, {
                columns: true,
                skip_empty_lines: true,
            });
        } catch (error) {
            console.log(
                "No existing file found or error reading file:",
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

    async saveToCSV(data, filename) {
        try {
            this.logProgress("Preparing to save data...");
            await this.ensureDataDirectory();
            const filePath = path.join(this.dataDir, filename);

            this.logProgress("Reading existing data (if any)...");
            const existingData = await this.readExistingCSV(filename);

            this.logProgress("Merging new data with existing data...");
            const mergedData = await this.mergeAndUpdateData(
                data,
                existingData
            );

            const newRecords = data.length;
            const updatedRecords = mergedData.length - existingData.length;
            const totalRecords = mergedData.length;

            const flattenedData = mergedData.map((hotel) => ({
                Name: hotel.name,
                Price: hotel.price,
                Rating: hotel.rating,
                Address: hotel.address,
                "No. review": hotel.numberOfReviews,
                "Popular Facilities": hotel.popularFacilities,
                "All Facilities": hotel.allFacilities
                    ?.map(
                        (group) =>
                            `${group.groupTitle}: ${group.items.join(", ")}`
                    )
                    .join("\n"),
                "Room Details": hotel.roomDetailsList?.join("\n"),
                "Hotel Rules": hotel.houseRules,
                Description: hotel.description,
                URL: hotel.url,
                FirstAdded: hotel.FirstAdded,
                LastUpdated: hotel.LastUpdated,
            }));

            const filteredData = flattenedData.filter(
                (item) => item.Name && typeof item.Name === "string"
            );
            filteredData.sort((a, b) => a.Name.localeCompare(b.Name));

            await fs.writeFile(
                filePath,
                stringify(flattenedData, {
                    header: true,
                    columns: Object.keys(filteredData[0]),
                })
            );

            console.log(`Total records in file: ${totalRecords}`);
            console.log(`New records added: ${newRecords}`);
            console.log(`Records updated: ${updatedRecords}`);
            console.log(`File saved to: ${filePath}`);
            this.logTimeElapsed();
        } catch (error) {
            console.error("Error saving to CSV:", error);
            throw error;
        }
    }

    async createBackup(filename) {
        try {
            const filePath = path.join(this.dataDir, filename);
            const backupPath = path.join(
                this.dataDir,
                `backup_${filename}_${Date.now()}.csv`
            );

            try {
                await fs.access(filePath);
                await fs.copyFile(filePath, backupPath);
                console.log(`Backup created: ${backupPath}`);
            } catch (error) {
                console.log("No existing file to backup");
            }
        } catch (error) {
            console.error("Error creating backup:", error);
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

const runCrawler = async () => {
    const crawler = new BookingCrawler({
        dataDir: "data",
    });

    try {
        await crawler.initialize();

        await crawler.createBackup("dalat_hotels.csv");

        const hotels = await crawler.crawlHotels(
            "dalat-vietnam",
            "2024-12-22",
            "2024-12-23"
        );

        await crawler.saveToCSV(hotels, "dalat_hotels.csv");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await crawler.close();
        console.log(`\nEnd time: ${new Date().toLocaleString()}`);
    }
};

runCrawler();
export default BookingCrawler;
