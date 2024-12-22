import retrievalService from "./retrievalService.js";
import { geminiModel } from "../config/gemini-config.js";
import {
    HumanMessage,
    SystemMessage,
    AIMessage,
} from "@langchain/core/messages";

async function askQuestion(question, chatHistory = []) {
    try {
        const sourceDocuments = await retrievalService.getRelevantDocuments(
            question
        );
        if (!sourceDocuments || sourceDocuments.length === 0) {
            return {
                text: "I do not have enough information to provide a suggestion.",
            };
        }

        const formattedContext = sourceDocuments
            .map((doc) => {
                return `
                Name: ${doc.metadata.name || "N/A"}
                Address: ${doc.metadata.address || "N/A"}
                Facilities: ${doc.metadata.facilities || "N/A"}
                Price: ${doc.metadata.price || "N/A"}
                Rating: ${doc.metadata.rating || "N/A"}
            `;
            })
            .join("\n\n");

        const inputMessages = [
            new SystemMessage({
                content: `Here is the list of hotels:\n\n${formattedContext}\n\n
                Based on this information, You are an expert travel assistant with extensive knowledge of destinations, accommodations, and travel planning.
Your role is to:
1. Provide detailed travel recommendations based on the given context.
2. Respond consistently and concisely, avoiding contradictory answers.
3. If the provided data is insufficient, clearly state: "The provided information does not contain this detail."
4. Provide actionable advice based on user preferences..`,
            }),
            ...chatHistory.map((msg) =>
                msg.role === "user"
                    ? new HumanMessage({
                          content: msg.content,
                      })
                    : new AIMessage({
                          content: msg.content,
                      })
            ),
            new HumanMessage({
                content: question,
            }),
        ];

        const response = await geminiModel.invoke(inputMessages);

        return {
            text: response.content,
        };
    } catch (error) {
        console.error("Error answering question:", error);
        return {
            text: "An error occurred while processing your question.",
        };
    }
}

export default askQuestion;
