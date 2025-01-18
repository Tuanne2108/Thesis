import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.EMBEDDED_API_KEY,
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
});

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    apiKey: process.env.GEMINI_API_KEY,
    maxOutputTokens: 2048,
});

export { embeddings, geminiModel };