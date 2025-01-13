import askQuestion from "../services/questionService.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

export const handleChatRequest = async (req, res, next) => {
    const { query } = req.body;
    const userId = req.user?._id;

    try {
        let chatHistory = [];
        if (userId) {
            const user = await User.findById(userId);
            if (user && user.chats) {
                chatHistory = user.chats.map((chat) => ({
                    role: chat.role,
                    content: chat.content,
                }));
            }
        }

        const response = await askQuestion(query, chatHistory);

        if (!response || !response.text) {
            return next(createError(500, "Failed to get a response from the model"));
        }

        const userMessage = {
            role: "user",
            content: query,
        };

        const assistantMessage = {
            role: "assistant",
            content: response.text,
            source: response.sources
        };

        if (userId) {
            await saveChatHistory(userId, userMessage, assistantMessage);
        }

        res.status(200).json({
            success: true,
            response: response.text,
            source: response.sources,
            messages: [userMessage, assistantMessage],
        });
    } catch (error) {
        console.error("Error in chat request:", error);
        next(createError(500, "Failed to process chat request"));
    }
};

// export const getChatHistory = async (req, res, next) => {
//     if (!req.user) {
//         return next(createError(401, "User not authenticated"));
//     }

//     const userId = req.user._id;

//     try {
//         const user = await User.findById(userId);

//         if (!user) {
//             return next(createError(404, "User not found"));
//         }

//         res.status(200).json({
//             success: true,
//             chats: user.chats,
//         });
//     } catch (error) {
//         console.error("Error fetching chat history:", error);
//         next(createError(500, "Failed to fetch chat history"));
//     }
// };

// export const clearChatHistory = async (req, res, next) => {
//     if (!req.user) {
//         return next(createError(401, "User not authenticated"));
//     }

//     try {
//         const userId = req.user._id;
//         await User.findByIdAndUpdate(userId, { $set: { chats: [] } });

//         res.status(200).json({
//             success: true,
//             message: "Chat history cleared successfully",
//         });
//     } catch (error) {
//         console.error("Error clearing chat history:", error);
//         next(createError(500, "Failed to clear chat history"));
//     }
// };

// export const saveChatHistory = async (userId, userMessage, assistantMessage) => {
//     try {
//         const user = await User.findById(userId);
//         if (!user) {
//             throw new Error("User not found");
//         }

//         // Append new chat messages to the user's chat history
//         const newChats = [...(user.chats || []), userMessage, assistantMessage];
//         await User.findByIdAndUpdate(userId, { chats: newChats });
//     } catch (error) {
//         console.error("Error saving chat history:", error);
//     }
// };
