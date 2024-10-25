const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config/config');

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

async function generateResponse(query, context) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Bạn là một chuyên gia du lịch. Hãy cung cấp thông tin về ${query}. Thông tin: ${context}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

module.exports = { generateResponse };