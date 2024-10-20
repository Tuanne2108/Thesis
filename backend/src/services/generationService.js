const { ChatGoogleGenerativeAI } = require("@google/generative-ai");

const generateResponse = async (query, relevantDocs) => {
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-pro",
        apiKey: "AIzaSyBPZjudnDUgz5p4sCdHq5kZk4uSvGuS24o",
        maxOutputTokens: 2048,
    });

    const context = relevantDocs.map((doc) => doc._source.content).join("\n");
    const prompt = `Based on the following context, answer the question.

    Context:
    ${context}
    
    Question: ${query}
    
    Answer:`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = result.response;

    return response.text();
};

module.exports = { generateResponse };
