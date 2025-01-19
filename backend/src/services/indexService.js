import { indexAttractions } from './indexer/attractionsIndexService.js';
import { indexDocuments } from './indexer/hotelsIndexService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// await indexAttractions(
//     path.join(__dirname, '../data/attractions/Nha-Trang/Nha-Trang_attractions.csv'),
//     {
//         skipExisting: false,
//         batchSize: 50,
//         updateExisting: true
//     }
// );

// await indexAttractions(
//     path.join(__dirname, '../data/attractions/Sapa/Sapa_attractions.csv'),
//     {
//         skipExisting: false,
//         batchSize: 50,
//         updateExisting: true
//     }
// );

// await indexAttractions(
//     path.join(__dirname, '../data/attractions/Vung-Tau/Vung-Tau_attractions.csv'),
//     {
//         skipExisting: false,
//         batchSize: 50,
//         updateExisting: true
//     }
// );