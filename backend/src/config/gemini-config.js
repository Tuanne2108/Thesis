const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    apiKey: "AIzaSyBPZjudnDUgz5p4sCdHq5kZk4uSvGuS24o",
    maxOutputTokens: 2048,
});

module.exports = { geminiModel };
