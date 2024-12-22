import elasticClient from "../config/elasticDb.js";
import { generateEmbeddings } from "./embeddingService.js";
import DocumentLoader from "./documentLoader.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/Dalat.csv");

export const indexDocuments = async () => {
    try {
        const loader = new DocumentLoader();
        const documents = await loader.loadDocuments(filePath);

        const normalizedData = documents
            .map((doc) => {
                try {
                    return JSON.parse(doc.text);
                } catch (error) {
                    console.error("Error parsing document:", doc.text);
                    return null;
                }
            })
            .filter((doc) => doc !== null);

        const texts = normalizedData.map(
            (hotel) =>
                `${hotel.Name}. ${hotel.Facilities}. Located at ${hotel.Address}. Price: ${hotel["Price (VND/night)"]}. Rating: ${hotel["Rating (out of 10)"]}/10.`
        );

        const embeddings = await generateEmbeddings(texts);

        for (let i = 0; i < normalizedData.length; i++) {
            const hotel = normalizedData[i];
            const document = {
                pageContent: texts[i],
                metadata: {
                    name: hotel.Name,
                    address: hotel.Address,
                    phone: hotel.Phone,
                    price: hotel["Price (VND/night)"],
                    facilities: hotel.Facilities,
                    rating: parseFloat(hotel["Rating (out of 10)"]),
                },
                id: hotel.Name.replace(/\s+/g, "_"),
            };

            await elasticClient.index({
                index: "hotels",
                body: {
                    embedding: embeddings[i],
                    ...document,
                },
            });
        }

        console.log("All documents have been indexed successfully.");
    } catch (error) {
        console.error("Error processing documents:", error);
    }
};

indexDocuments();