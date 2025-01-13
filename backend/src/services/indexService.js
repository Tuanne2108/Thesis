import { indexAttractions } from './indexer/attractionsIndexService.js';
import { indexDocuments } from './indexer/hotelsIndexService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// // Index file đầu tiên
// await indexDocuments(
//     path.join(__dirname, '../data/hotels/Da-Lat_hotels.csv'),
//     {
//         skipExisting: false,
//         batchSize: 100,
//         updateExisting: true
//     }
// );

// // Index file thứ hai
// await indexDocuments(
//     path.join(__dirname, '../data/hotels/Hoi-An_hotels.csv'),
//     {
//         skipExisting: true,  // Bỏ qua nếu đã tồn tại
//         batchSize: 50,       // Giảm batch size nếu cần
//         updateExisting: true // Cho phép update nếu data mới hơn
//     }
// );

// await indexDocuments(
//     path.join(__dirname, '../data/hotels/Nha-Trang_hotels.csv'),
//     {
//         skipExisting: true,  // Bỏ qua nếu đã tồn tại
//         batchSize: 50,       // Giảm batch size nếu cần
//         updateExisting: true // Cho phép update nếu data mới hơn
//     }
// );

// await indexDocuments(
//     path.join(__dirname, '../data/hotels/Sapa_hotels.csv'),
//     {
//         skipExisting: true,  // Bỏ qua nếu đã tồn tại
//         batchSize: 50,       // Giảm batch size nếu cần
//         updateExisting: true // Cho phép update nếu data mới hơn
//     }
// );

await indexAttractions(
    path.join(__dirname, '../data/attractions/Da-Lat/Da-Lat_attractions.csv'),
    {
        skipExisting: false,
        batchSize: 50,
        updateExisting: true
    }
);