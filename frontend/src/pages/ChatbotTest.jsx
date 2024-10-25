import React, { useState } from "react";
import SearchForm from "../components/chatbot/SearchForm";
import ResponseDisplay from "../components/chatbot/ResponseDisplay";

function ChatbotTest() {
    const [response, setResponse] = useState("");

    const handleSearch = async (query) => {
        try {
            const res = await fetch("http://localhost:3000/api/chatbot/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });
            const data = await res.json();
            setResponse(data.response);
        } catch (error) {
            console.error("Error:", error);
            setResponse("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="App">
            <h1>Hệ thống Hỗ trợ Du lịch</h1>
            <SearchForm onSearch={handleSearch} />
            <ResponseDisplay response={response} />
        </div>
    );
}

export default ChatbotTest;
