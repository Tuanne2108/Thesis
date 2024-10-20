const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

async function generateCompanyName() {
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-pro",
        apiKey: "AIzaSyBPZjudnDUgz5p4sCdHq5kZk4uSvGuS24o",
        maxOutputTokens: 2048,
    });

    const res = await model.invoke(
        "What is president of USA?"
    );
    console.log(res);
}

generateCompanyName().catch((err) => {
    console.error("Error:", err);
});
