const elasticClient = require("../config/elasticDb");
const geminiModel = require("../config/gemini-config");
const Hotel = require("../models/hotelModel");

const handleChatRequest = async (req, res) => {
    try {
        const { query } = req.body;

        // Search in Elasticsearch
        const elasticResults = await elasticClient.search({
            index: "hotels",
            body: {
                query: {
                    multi_match: {
                        query: query,
                        fields: ["name", "description", "location"],
                    },
                },
            },
        });

        // Search in MongoDB
        const mongoResults = await Hotel.find({ $text: { $search: query } });

        // Combine results
        const allResults = [
            ...elasticResults.body.hits.hits.map((hit) => hit._source),
            ...mongoResults,
        ];

        // Prepare context for Gemini
        const context = allResults
            .map(
                (hotel) =>
                    `${hotel.name}: ${hotel.description}. Địa chỉ: ${hotel.location}. Giá: ${hotel.price}. Đánh giá: ${hotel.rating}/5.`
            )
            .join("\n");

        // Generate response using Gemini
        const prompt = `Bạn là một chuyên gia du lịch. Hãy cung cấp thông tin về "${query}". Thông tin: ${context}`;
        const result = await geminiModel.generateContent(prompt);
        const response = result.response.text();

        res.json({ response });
    } catch (error) {
        console.error("Error in chat request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { handleChatRequest };
