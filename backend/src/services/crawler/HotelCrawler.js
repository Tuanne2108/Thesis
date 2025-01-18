import path from "path";
import { promises as fs } from "fs";
import BaseCrawler from "./baseCrawler.js";

class HotelCrawler extends BaseCrawler {
    constructor(options = {}) {
        super(options);
        this.hotelDir = path.join(this.baseDir, "hotels");
    }

    async initialize() {
        await super.initialize();
        await fs.mkdir(this.hotelDir, { recursive: true });
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

    async crawlHotels(urlList) {
        for (const item of urlList) {
            const { url, city } = item;
            
            this.logProgress(`Starting hotel crawl for ${city}`);
            
            await this.navigateWithRetry(this.page, url);
            await this.delay(2000);
            await this.handleCookieConsent();
            await this.loadAllResults(this.page, '[data-testid="property-card"]');

            const selector = await this.findWorkingSelector(this.page, [
                'div[data-testid="property-card"]',
            ]);

            await this.autoScroll(this.page);
            const hotels = await this.extractHotelData(this.page, selector);

            const detailedHotels = [];
            for (let i = 0; i < hotels.length; i++) {
                const hotel = hotels[i];
                this.logProgress(
                    `Processing hotel ${i + 1}/${hotels.length}: ${hotel.name}`
                );
                await this.navigateWithRetry(this.page, hotel.url);
                await this.delay(2000);
                const details = await this.extractHotelDetails(this.page);
                detailedHotels.push({ ...hotel, ...details });
            }

            await this.saveToCSV(
                detailedHotels, 
                `${city}_hotels.csv`, 
                this.hotelDir,
                this.flattenHotelData
            );
        }
    }
}

export default HotelCrawler;