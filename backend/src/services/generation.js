import askQuestion from "./ask.js";

async function main() {
    const questions = [
        "Suggest a hotel in Dalat with a rating above 8 and free Wi-Fi.",
        "Are there any hotels near the market",
        "Are there any hotels near the city center with family rooms?",
    ];

    let chatHistory = [];

    for (const question of questions) {
        console.log(`Processing Question: "${question}"`);
        const response = await askQuestion(question, chatHistory);

        chatHistory.push({ role: "user", content: question });
        chatHistory.push({ role: "assistant", content: response?.text || "No answer available" });

        console.log("=================================================");
    }
}

main();
