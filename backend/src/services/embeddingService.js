import { embeddings } from "../config/gemini-config.js";

export const generateEmbeddings = async (texts) => {
    if (!Array.isArray(texts)) {
        throw new Error("Expected an array of texts");
    }
    return await embeddings.embedDocuments(texts);
};

export const questionEmbeddings = async (texts) => {
    if (typeof texts !== "string") {
        throw new Error("Expected a single string for embedding query");
    }
    return await embeddings.embedQuery(texts);
};

