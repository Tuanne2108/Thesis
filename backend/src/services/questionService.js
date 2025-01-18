import retrievalService from "./retrievalService.js";
import { geminiModel } from "../config/gemini-config.js";
import { questionEmbeddings } from "./embeddingService.js";
import { determineQueryType } from "../utils/queryHelper.js";
import { formatHotelData, formatAttractionData } from "../utils/formatters.js";
import { SYSTEM_PROMPTS } from "../constants/prompts.js";
import {
    HumanMessage,
    SystemMessage,
    AIMessage,
} from "@langchain/core/messages";

async function askQuestion(question, chatHistory = []) {
    try {
        const queryType = determineQueryType(question);
        const embeddedQuestion = await questionEmbeddings(question);
        const relevantDocs = await retrievalService.getRelevantDocuments({
            originalQuestion: question,
            embedding: embeddedQuestion,
            indices:
                queryType === "general"
                    ? ["hotels", "attractions"]
                    : [queryType === "hotel" ? "hotels" : "attractions"],
        });
        console.log("queryType", queryType);
        console.log("relevant", relevantDocs);

        if (!relevantDocs?.length) {
            return {
                text: "I apologize, but I don't have enough information to provide a relevant suggestion for your query.",
                sources: [],
            };
        }

        const formattedContext = relevantDocs.map((doc) =>
            doc.metadata.type === "hotel"
                ? formatHotelData(doc)
                : formatAttractionData(doc)
        );

        console.log("formattedContext", formattedContext);

        const response = await geminiModel.invoke([
            new SystemMessage({
                content: `${SYSTEM_PROMPTS[queryType]}Here is the relevant information:${formattedContext}`,
            }),
            ...chatHistory.map((msg) =>
                msg.role === "user"
                    ? new HumanMessage({ content: msg.content })
                    : new AIMessage({ content: msg.content })
            ),
            new HumanMessage({ content: question }),
        ]);

        console.log('response', response.content);

        return {
            text: response.content,
            sources: relevantDocs.map((doc) => ({
                name: doc.metadata.name,
                type: doc.metadata.type,
                url: doc.metadata.url,
            })),
        };
    } catch (error) {
        console.error("Error answering question:", error);
        return {
            text: "I apologize, but I encountered an error while processing your question. Please try again.",
            sources: [],
        };
    }
}

export default askQuestion;
