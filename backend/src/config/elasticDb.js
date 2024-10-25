const { Client } = require("@elastic/elasticsearch");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { TaskType } = require("@google/generative-ai");

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: "AIzaSyBPZjudnDUgz5p4sCdHq5kZk4uSvGuS24o",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
});

const config = {
    node: process.env.ELASTIC_URL || "http://127.0.0.1:9200",
};

if (process.env.ELASTIC_USERNAME && process.env.ELASTIC_PASSWORD) {
    config.auth = {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    };
}

const elasticClient = new Client(config);

module.exports = { elasticClient, config, embeddings };
