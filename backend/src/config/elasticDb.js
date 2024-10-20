const {
    ElasticVectorSearch,
} = require("@langchain/community/vectorstores/elasticsearch");
const { generateEmbedding } = require("../services/embeddingService");
const { Client } = require("@elastic/elasticsearch");
const fs = require("fs");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { TaskType } = require("@google/generative-ai");

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey:"AIzaSyBPZjudnDUgz5p4sCdHq5kZk4uSvGuS24o",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
});

// Elasticsearch configuration
const config = {
    node: process.env.ELASTIC_URL || "http://127.0.0.1:9200",
};

// Authentication if username and password are provided
if (process.env.ELASTIC_USERNAME && process.env.ELASTIC_PASSWORD) {
    config.auth = {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    };
}

// Initialize Elasticsearch Client
const elasticClient = new Client(config);

// Elasticsearch Vector Search Setup
const clientArgs = {
    client: elasticClient,
    indexName: process.env.ELASTIC_INDEX || "pdf_docs",
};

// Initialize Custom Vector Search
const vectorStore = new ElasticVectorSearch(embeddings, clientArgs);

const similaritySearchResults = vectorStore.similaritySearch(
    "lời lẽ khó chịu",
    2
);

console.log(similaritySearchResults);

module.exports = { elasticClient, vectorStore };
