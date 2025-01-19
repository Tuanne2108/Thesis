import HotelCrawler from './HotelCrawler.js';
import AttractionCrawler from './AttractionCrawler.js';

const urlList = {
    hotels: [
        {
            url:"https://www.booking.com/searchresults.en-gb.html?ss=Sapa&ssne=Nha+Trang&ssne_untouched=Nha+Trang&label=gen173bo-1DEhFhdHRyYWN0aW9uc19pbmRleCiCAjjoB0gJWANo9AGIAQGYAQm4ARfIAQzYAQPoAQH4AQaIAgGYAgKoAgO4AtGH3rsGwAIB0gIkYzc4Y2RkNTItM2E4OC00YWY3LWFkZGItZTJjNmMyNjE1ODY02AIE4AIB&sid=a00d49f16300ccfe35bc183f5c991edb&aid=304142&lang=en-gb&sb=1&src_elem=sb&src=searchresults&dest_id=-3728113&dest_type=city&ac_position=0&ac_click_type=b&ac_langcode=xu&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=80462f877b8010ba&ac_meta=GhA4MDQ2MmY4NzdiODAxMGJhIAAoATICeHU6BFNhcGFAAEoAUAA%3D&checkin=2025-01-20&checkout=2025-01-21&group_adults=2&no_rooms=1&group_children=0",
            city:"Sapa"
        },
        // {
        //     url: "https://www.booking.com/searchresults.en-gb.html?ss=Vung+Tau&ssne=Vung+Tau&ssne_untouched=Vung+Tau&efdco=1&label=gen173bo-1DEhFhdHRyYWN0aW9uc19pbmRleCiCAjjoB0gJWANo9AGIAQGYAQm4ARfIAQzYAQPoAQH4AQaIAgGYAgKoAgO4AtGH3rsGwAIB0gIkYzc4Y2RkNTItM2E4OC00YWY3LWFkZGItZTJjNmMyNjE1ODY02AIE4AIB&sid=a00d49f16300ccfe35bc183f5c991edb&aid=304142&lang=en-gb&sb=1&src_elem=sb&src=searchresults&dest_id=-3733750&dest_type=city&checkin=2025-01-20&checkout=2025-01-21&group_adults=2&no_rooms=1&group_children=0",
        //     city: "Vung-Tau"
        // },
        // {
        //     url:"https://www.booking.com/searchresults.en-gb.html?ss=da+lat&ssne=Vung+Tau&ssne_untouched=Vung+Tau&label=gen173bo-1DEhFhdHRyYWN0aW9uc19pbmRleCiCAjjoB0gJWANo9AGIAQGYAQm4ARfIAQzYAQPoAQH4AQaIAgGYAgKoAgO4AtGH3rsGwAIB0gIkYzc4Y2RkNTItM2E4OC00YWY3LWFkZGItZTJjNmMyNjE1ODY02AIE4AIB&sid=a00d49f16300ccfe35bc183f5c991edb&aid=304142&lang=en-gb&sb=1&src_elem=sb&src=searchresults&checkin=2025-01-20&checkout=2025-01-21&group_adults=2&no_rooms=1&group_children=0",
        //     city:"Da-Lat"
        // },
        // {
        //     url:"https://www.booking.com/searchresults.en-gb.html?ss=Nha+Trang%2C+Khanh+Hoa%2C+Vietnam&ssne=Da+Lat&ssne_untouched=Da+Lat&label=gen173bo-1DEhFhdHRyYWN0aW9uc19pbmRleCiCAjjoB0gJWANo9AGIAQGYAQm4ARfIAQzYAQPoAQH4AQaIAgGYAgKoAgO4AtGH3rsGwAIB0gIkYzc4Y2RkNTItM2E4OC00YWY3LWFkZGItZTJjNmMyNjE1ODY02AIE4AIB&sid=a00d49f16300ccfe35bc183f5c991edb&aid=304142&lang=en-gb&sb=1&src_elem=sb&src=searchresults&dest_id=-3723998&dest_type=city&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=7c9c2f74fc1b0658&ac_meta=GhA3YzljMmY3NGZjMWIwNjU4IAAoATICZW46CE5oYSBUcmFuQABKAFAA&checkin=2025-01-20&checkout=2025-01-21&group_adults=2&no_rooms=1&group_children=0",
        //     city:"Nha-Trang"
        // },
        // {
        //     url: "https://www.booking.com/searchresults.en-gb.html?ss=Hoi+An%2C+Quang+Nam%2C+Vietnam&ssne=Sa+Pa&ssne_untouched=Sa+Pa&label=gen173bo-1DEhFhdHRyYWN0aW9uc19pbmRleCiCAjjoB0gJWANo9AGIAQGYAQm4ARfIAQzYAQPoAQH4AQaIAgGYAgKoAgO4AtGH3rsGwAIB0gIkYzc4Y2RkNTItM2E4OC00YWY3LWFkZGItZTJjNmMyNjE1ODY02AIE4AIB&sid=a00d49f16300ccfe35bc183f5c991edb&aid=304142&lang=en-gb&sb=1&src_elem=sb&src=searchresults&dest_id=-3715584&dest_type=city&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=e9e02f98b0aa10cc&ac_meta=GhBlOWUwMmY5OGIwYWExMGNjIAAoATICZW46BEhvaSBAAEoAUAA%3D&checkin=2025-01-20&checkout=2025-01-21&group_adults=2&no_rooms=1&group_children=0",
        //     city: "Hoi-An"
        // },
    ],
    attractions: [
        // {
        //     url:"https://www.booking.com/attractions/searchresults/vn/sapa.en-gb.html?adplat=www-searchresults_irene-web_shell_header-attraction-missing_creative-7lBbAoS5PZVjU6ubKQ1ScO&aid=304142&client_name=b-web-shell-bff&distribution_id=7lBbAoS5PZVjU6ubKQ1ScO&source=search_box&sort_by=trending",
        //     city:"Sapa"
        // },
        // {
        //     url:"https://www.booking.com/attractions/searchresults/vn/vung-tau.en-gb.html?adplat=www-searchresults_irene-web_shell_header-attraction-missing_creative-7lBbAoS5PZVjU6ubKQ1ScO&aid=304142&client_name=b-web-shell-bff&distribution_id=7lBbAoS5PZVjU6ubKQ1ScO&source=search_box",
        //     city: "Vung-Tau"
        // },
        // {
        //     url:"https://www.booking.com/attractions/searchresults/vn/dalat.en-gb.html?adplat=www-searchresults_irene-web_shell_header-attraction-missing_creative-7lBbAoS5PZVjU6ubKQ1ScO&aid=304142&client_name=b-web-shell-bff&distribution_id=7lBbAoS5PZVjU6ubKQ1ScO&source=search_box",
        //     city: "Da-Lat"
        // },
        // {
        //     url: "https://www.booking.com/attractions/searchresults/vn/nha-trang.en-gb.html?adplat=www-searchresults_irene-web_shell_header-attraction-missing_creative-7lBbAoS5PZVjU6ubKQ1ScO&aid=304142&client_name=b-web-shell-bff&distribution_id=7lBbAoS5PZVjU6ubKQ1ScO&source=search_box",
        //     city: "Nha-Trang"
        // },
        // {
        //     url: "https://www.booking.com/attractions/searchresults/vn/hoi-an.en-gb.html?adplat=www-searchresults_irene-web_shell_header-attraction-missing_creative-7lBbAoS5PZVjU6ubKQ1ScO&aid=304142&client_name=b-web-shell-bff&distribution_id=7lBbAoS5PZVjU6ubKQ1ScO&source=search_box",
        //     city: "Hoi-An"
        // },
    ]
};

async function crawlHotels() {
    console.log("Starting hotel crawler...");
    const hotelCrawler = new HotelCrawler();
    try {
        await hotelCrawler.initialize();
        await hotelCrawler.crawlHotels(urlList.hotels);
    } catch (error) {
        console.error("Error in hotel crawler:", error);
        throw error;
    } finally {
        await hotelCrawler.close();
    }
}

async function crawlAttractions() {
    console.log("Starting attraction crawler...");
    const attractionCrawler = new AttractionCrawler();
    try {
        await attractionCrawler.initialize();
        await attractionCrawler.crawlAttractions(urlList.attractions);
    } catch (error) {
        console.error("Error in attraction crawler:", error);
        throw error;
    } finally {
        await attractionCrawler.close();
    }
}

async function startParallelCrawling() {
    try {
        await Promise.all([
            crawlHotels(),
            // crawlAttractions()
        ]);
        
        console.log("\nAll crawling completed successfully!");
    } catch (error) {
        console.error("Error during parallel crawling:", error);
    }
}

startParallelCrawling();