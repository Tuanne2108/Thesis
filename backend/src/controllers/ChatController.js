import geminiModel from '../config/gemini-config.js';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import User from '../models/User.js';
import { createError } from '../utils/error.js';

const systemPrompt = `You are an expert travel assistant with extensive knowledge of destinations, accommodations, and travel planning. 
Your role is to:
- Provide detailed travel recommendations
- Help with itinerary planning
- Offer insights about destinations
- Suggest accommodations based on preferences
- Share local customs and travel tips
- Assist with budgeting and cost estimates

Please be conversational, friendly, and provide specific, actionable advice.`;

const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", "{input}"]
]);

export const handleChatRequest = async (req, res, next) => {
    const { query } = req.body;
    const userId = req.user?._id;

    try {
        const chain = prompt.pipe(geminiModel);

        const response = await chain.invoke({
            input: query,
            message: query,
        });

        const userMessage = {
            role: 'user',
            content: query
        };

        const assistantMessage = {
            role: 'assistant',
            content: response.geminiModel.content
        };
        console.log('response: ' + JSON.stringify(response));
        if (userId) {
            await saveChatHistory(userId, userMessage, assistantMessage);
        }

        res.status(200).json({
            success: true,
            response: response.text,
            messages: [userMessage, assistantMessage]
        });

    } catch (error) {
        console.error("Error in chat request:", error);
        next(createError(500, "Failed to process chat request"));
    }
};

export const getChatHistory = async (req, res, next) => {
    if (!req.user) {
        return next(createError(401, "User not authenticated"));
    }

    const userId = req.user._id;
    console.log('userId', userId);
    try {
        const user = await User.findById(userId);

        if (!user) {
            return next(createError(404, "User not found"));
        }

        res.status(200).json({
            success: true,
            chats: user.chats,
        });

    } catch (error) {
        console.error("Error fetching chat history:", error);
        next(createError(500, "Failed to fetch chat history"));
    }
};


export const clearChatHistory = async (req, res, next) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { $set: { chats: [] } });

        res.status(200).json({
            success: true,
            message: "Chat history cleared successfully"
        });

    } catch (error) {
        console.error("Error clearing chat history:", error);
        next(createError(500, "Failed to clear chat history"));
    }
};
export const saveChatHistory = async (chatHistory) => {};