import { indexDocuments, retrieveDocuments } from '../services/elasticsearchService.js';
import { answerQuestion } from '../services/geminiService.js';

export const processDocuments = async (documents) => {
    await indexDocuments(documents);
};

export const handleQuestion = async (question) => {
    const relevantDocs = await retrieveDocuments(question);
    const context = relevantDocs.map(doc => doc.text).join("\n");
    return await answerQuestion(question, context);
};