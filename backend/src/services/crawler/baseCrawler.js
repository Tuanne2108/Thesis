import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";

class BaseCrawler {
    constructor(options = {}) {
        this.baseDir = options.baseDir || "data";
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

    async loadAllResults(page, itemSelector) {
        const selector = itemSelector || '[data-testid="property-card"]';
        
        this.logProgress(`Starting to load results (max 1000 items) using selector: ${selector}`);
        let previousHeight = 0;
        let loadMoreAttempts = 0;
        const maxAttempts = 50;
        let totalItems = 0;
        const ITEMS_LIMIT = 1000;
    
        while (loadMoreAttempts < maxAttempts) {
            try {
                await this.autoScroll(page);
                await this.delay(1000);
    
                totalItems = await page.evaluate((selector) => {
                    const items = document.querySelectorAll(selector);
                    return items.length;
                }, selector);
    
                this.logProgress(`Current items loaded: ${totalItems}`);
    
                if (totalItems >= ITEMS_LIMIT) {
                    this.logProgress(`Reached ${ITEMS_LIMIT} items limit, stopping`);
                    break;
                }
    
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
        
        this.logProgress(`Finished loading results. Total items: ${totalItems}`);
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

    async readExistingCSV(filename, dir) {
        try {
            const filePath = path.join(dir, filename);
            const content = await fs.readFile(filePath, "utf-8");
            return parse(content, {
                columns: true,
                skip_empty_lines: true,
            });
        } catch (error) {
            console.log(
                `No existing file found or error reading file:`,
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

    async saveToCSV(data, filename, dir, flattenFunc) {
        try {
            this.logProgress(`Preparing to save data...`);
            const filePath = path.join(dir, filename);

            this.logProgress(`Reading existing data (if any)...`);
            const existingData = await this.readExistingCSV(filename, dir);

            this.logProgress(`Merging new data with existing data...`);
            const mergedData = await this.mergeAndUpdateData(
                data,
                existingData
            );

            const flattenedData = flattenFunc(mergedData);

            await fs.writeFile(
                filePath,
                stringify(flattenedData, {
                    header: true,
                    columns: Object.keys(flattenedData[0]),
                })
            );

            console.log(`Data saved to: ${filePath}`);
            console.log(`Total records: ${mergedData.length}`);
            
            return mergedData;
        } catch (error) {
            console.error(`Error saving data:`, error);
            throw error;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

export default BaseCrawler;