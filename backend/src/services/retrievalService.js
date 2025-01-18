import { ElasticVectorSearch } from "@langchain/community/vectorstores/elasticsearch";
import elasticClient from "../config/elasticDb.js";
import { embeddings } from "../config/gemini-config.js";

class RetrieverService {
    constructor() {
        this.retrievers = new Map();
        this.indices = ['hotels', 'attractions'];
    }

    async initialize(indexName) {
        if (!this.retrievers.has(indexName)) {
            try {
                const retriever = await ElasticVectorSearch.fromExistingIndex(
                    embeddings,
                    {
                        client: elasticClient,
                        indexName: indexName,
                        vectorField: "embedding",
                        dims: 768,
                        similarity: "cosine",
                    }
                );
                this.retrievers.set(indexName, retriever);
            } catch (error) {
                console.error(`Error initializing retriever for ${indexName}:`, error);
                throw error;
            }
        }
        return this.retrievers.get(indexName);
    }

    async initializeAll() {
        await Promise.all(
            this.indices.map(index => this.initialize(index))
        );
    }

    async getRelevantDocuments(options) {
        const { originalQuestion, embedding, indices = ['hotels'] } = options;
        try {
            const targetIndices = Array.isArray(indices) ? indices : [indices];
            
            await Promise.all(
                targetIndices.map(index => this.initialize(index))
            );
    
            const allDocsPromises = targetIndices.map(async (index) => {
                const retriever = this.retrievers.get(index);
                if (!retriever) {
                    console.warn(`No retriever found for index: ${index}`);
                    return [];
                }
    
                try {
                    const results = await retriever.similaritySearchVectorWithScore(
                        embedding,
                        5,
                        null,
                        {
                            vector: embedding,
                            index: index,
                            k: 3
                        }
                    );
                    
                    return results.map(([doc, score]) => ({
                        pageContent: doc.pageContent,
                        metadata: {
                            ...doc.metadata,
                            type: index.slice(0, -1),
                            score: score,
                            originalQuery: originalQuestion
                        }
                    }));
                } catch (error) {
                    console.error(`Error retrieving documents from ${index}:`, error);
                    return [];
                }
            });
    
            const results = await Promise.all(allDocsPromises);
            const allDocs = results.flat();
    
            if (allDocs.length > 0 && allDocs[0].metadata.score !== undefined) {
                allDocs.sort((a, b) => b.metadata.score - a.metadata.score);
            }
    
            return allDocs.slice(0, 5);
        } catch (error) {
            console.error("Error in getRelevantDocuments:", error);
            throw error;
        }
    }

    async indexExists(indexName) {
        try {
            return await elasticClient.indices.exists({ index: indexName });
        } catch (error) {
            console.error(`Error checking index existence for ${indexName}:`, error);
            return false;
        }
    }

    async addIndex(indexName) {
        if (!this.indices.includes(indexName)) {
            this.indices.push(indexName);
            await this.initialize(indexName);
        }
    }
}

const retrieverService = new RetrieverService();

retrieverService.initializeAll().catch(error => {
    console.error("Error initializing retriever service:", error);
});

export default retrieverService;