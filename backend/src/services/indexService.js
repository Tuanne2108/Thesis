import { indexAttractions } from './indexer/attractionsIndexService.js';
import { indexDocuments } from './indexer/hotelsIndexService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

await indexAttractions(
    path.join(__dirname, '../data/attractions/Da-Lat/Da-Lat_attractions.csv'),
    {
        skipExisting: false,
        batchSize: 50,
        updateExisting: true
    }
);