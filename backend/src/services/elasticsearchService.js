const { Client } = require('@elastic/elasticsearch');

const config = {
    node: process.env.ELASTIC_URL || "http://127.0.0.1:9200",
};

if (process.env.ELASTIC_USERNAME && process.env.ELASTIC_PASSWORD) {
    config.auth = {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    };
}

const client = new Client(config);

async function indexHotel(hotel) {
  await client.index({
    index: 'hotels',
    body: hotel
  });
}

async function searchHotels(query) {
  const result = await client.search({
    index: 'hotels',
    body: {
      query: {
        multi_match: {
          query: query,
          fields: ['name', 'description', 'location']
        }
      }
    }
  });
  return result.body.hits.hits.map(hit => hit._source);
}

module.exports = { indexHotel, searchHotels };