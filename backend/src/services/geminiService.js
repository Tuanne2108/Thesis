import { geminiModel } from '../config/gemini-config.js';

export const answerQuestion = async (question, context) => {
    const answer = await geminiModel.invoke({
        prompt: `Based on the following context, answer the question: ${question}\nContext: ${context}`,
    });

    return answer;
};