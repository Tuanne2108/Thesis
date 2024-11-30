import { generateEmbeddingsResponse } from './embeddingService.js';
import { geminiModel } from '../config/gemini-config.js';
import { retrieveDocuments } from './elasticsearchService.js';

const searchAndAnswer = async (userQuery) => {
    const retrievedDocs = await retrieveDocuments(userQuery);

    const texts = retrievedDocs.map(doc => doc.text); 
    const concatenatedText = texts.join(' ');

    const answer = await geminiModel(concatenatedText, userQuery);

    return answer;
};

// Example usage
const userQuery = "What is the story about?";
searchAndAnswer(userQuery)
    .then(answer => console.log("Answer:", answer))
    .catch(error => console.error("Error:", error));