import { chatApi } from ".";

// Handle chat requests
export const handleChatRequest = async (data) => {
  try {
    const response = await chatApi.post("/chat", data);
    return response;
  } catch (error) {
    console.error("Error in chat request:", error);
    throw error;
  }
};

// Get chat history
// export const getChatHistory = async () => {
//   try {
//     const response = await chatApi.get("/history");
//     return response.data;
//   } catch (error) {
//     console.error("Error getting chat history:", error);
//     throw error;
//   }
// };

// Clear chat history
export const clearChatHistory = async () => {
  try {
    const response = await chatApi.delete("/history");
    return response.data;
  } catch (error) {
    console.error("Error clearing chat history:", error);
    throw error;
  }
};