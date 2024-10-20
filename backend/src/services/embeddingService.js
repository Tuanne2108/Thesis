const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateEmbedding = async (text) => {
  try {
    const API_KEY = "AIzaSyBPZjudnDUgz5p4sCdHq5kZk4uSvGuS24o"; 
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "embedding-001" });

    const result = await model.embedContent(text);

    // Ensure the result has the 'embedding' field and return it
    if (result && result.embedding) {
      return result.embedding;
    } else {
      throw new Error('No embedding returned from API');
    }
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
};

module.exports = { generateEmbedding };
