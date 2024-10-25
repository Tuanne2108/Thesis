const elasticClient = require('../config/elasticDB');
const Hotel = require('../models/hotelModel');

exports.ingestData = async (data) => {
  try {
    // Ingest into MongoDB
    await Hotel.insertMany(data);

    // Ingest into Elasticsearch
    const body = data.flatMap(doc => [{ index: { _index: 'hotels' } }, doc]);
    await elasticClient.bulk({ refresh: true, body });

    console.log('Data ingested successfully');
  } catch (error) {
    console.error('Error ingesting data:', error);
    throw error;
  }
};

exports.searchHotels = async (query) => {
  // Implement search logic here if needed
};