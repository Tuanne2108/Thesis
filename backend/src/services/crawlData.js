const puppeteer = require('puppeteer');
const { Client } = require('@elastic/elasticsearch');

// Elasticsearch client setup
const client = new Client({ node: 'http://localhost:9200' });

async function crawlBookingCom(destination) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`;
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('[data-testid="property-card"]', { timeout: 10000 });

    const hotels = await page.evaluate(() => {
      const hotelCards = document.querySelectorAll('[data-testid="property-card"]');
      return Array.from(hotelCards).map(card => ({
        name: card.querySelector('[data-testid="title"]')?.textContent.trim(),
        rating: card.querySelector('[data-testid="rating-stars"] span')?.getAttribute('aria-label') || 
                card.querySelector('.b5cd09854e')?.textContent.trim(),
        price: card.querySelector('.f6431b446c')?.textContent.trim() || 
               card.querySelector('[data-testid="price-and-discounted-price"]')?.textContent.trim(),
        location: card.querySelector('[data-testid="address"]')?.textContent.trim()
      }));
    });

    return hotels;
  } catch (error) {
    console.error("Error during crawling:", error);
    return [];
  } finally {
    await browser.close();
  }
}

async function storeInElasticsearch(hotels, destination) {
  try {
    // Create index if it doesn't exist
    const indexName = 'hotels/beach';
    const indexExists = await client.indices.exists({ index: indexName });
    if (!indexExists) {
      await client.indices.create({ index: indexName });
    }

    // Bulk insert hotels
    const operations = hotels.flatMap(doc => [
      { index: { _index: indexName } },
      { ...doc, destination, timestamp: new Date() }
    ]);

    const { body } = await client.bulk({ refresh: true, operations });

    if (body.errors) {
      const erroredDocuments = [];
      body.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            operation: operations[i * 2],
            document: operations[i * 2 + 1]
          });
        }
      });
      console.error('Failed to index some documents', erroredDocuments);
    }

    console.log(`Successfully indexed ${hotels.length} hotels for ${destination}`);
  } catch (error) {
    console.error('Error in storeInElasticsearch:', error);
    console.error('Elasticsearch response:', JSON.stringify(error.meta, null, 2));
  }
}

async function main() {
  const destination = "Ke Ga";
  try {
    console.log(`Starting to crawl data for ${destination}...`);
    const hotels = await crawlBookingCom(destination);
    console.log(`Crawled ${hotels.length} hotels.`);
    
    if (hotels && hotels.length > 0) {
      console.log('Crawled data:', JSON.stringify(hotels, null, 2));
      await storeInElasticsearch(hotels, destination);
    } else {
      console.log("No hotels found to store.");
    }
  } catch (error) {
    console.error("Error in main process:", error);
  } finally {
    await client.close();
  }
}

main().catch(console.error);