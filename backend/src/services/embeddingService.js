import { embeddings } from '../config/gemini-config.js';

export const generateEmbeddings = async (texts) => {
    if (!Array.isArray(texts)) {
        throw new Error("Expected an array of texts");
    }
    return await embeddings.embedDocuments(texts);
};
