import { ElasticVectorSearch } from "@langchain/community/vectorstores/elasticsearch";
import elasticClient from "../config/elasticDb.js";
import { embeddings } from "../config/gemini-config.js";

class RetrieverService {
    constructor() {
        this.retriever = null;
    }

    async initialize() {
        if (!this.retriever) {
            this.retriever = await ElasticVectorSearch.fromExistingIndex(
                embeddings,
                {
                    client: elasticClient,
                    indexName: "hotels",
                    vectorField: "embedding",
                    dims: 768,
                    similarity: "cosine",
                }
            );
        }
        return this.retriever;
    }

    async getRelevantDocuments(query) {
        if (!this.retriever) {
            await this.initialize();
        }
        return this.retriever.asRetriever().getRelevantDocuments(query);
    }
}

export default new RetrieverService();
