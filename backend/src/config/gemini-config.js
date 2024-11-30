import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { TaskType } from '@google/generative-ai';

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: "AIzaSyBPZjudnDUgz5p4sCdHq5kZk4uSvGuS24o",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    title: "Document title",
});

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    apiKey: "AIzaSyBPZjudnDUgz5p4sCdHq5kZk4uSvGuS24o",
    maxOutputTokens: 2048,
});

export { embeddings, geminiModel };