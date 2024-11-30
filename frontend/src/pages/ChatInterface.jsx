import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faMessage,
    faBed,
    faUser,
    faEllipsisH,
    faArrowLeft,
    faArrowRight,
    faPaperPlane,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import heroImage from "../assets/hero_image.jpeg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as ChatApi from "../api/ChatApi";

const ChatInterface = () => {
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const [isOpen, setIsOpen] = useState(true);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messages, setMessages] = useState([
        { role: "bot", text: "👋 Hi there! I'm your AI travel assistant. How can I help you today?" },
    ]);
    const [inputText, setInputText] = useState("");

    // useEffect(() => {
    //     if (currentUser) {
    //         loadChatHistory();
    //     }
    // }, [currentUser]);

    // Scroll to bottom of messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // const loadChatHistory = async () => {
    //     try {
    //         setIsLoading(true);
    //         const response = await ChatApi.getChatHistory();
    //         if (response.success && response.chats.length > 0) {
    //             const formattedMessages = response.chats.map(chat => ({
    //                 role: chat.role === 'assistant' ? 'bot' : chat.role,
    //                 text: chat.content
    //             }));
    //             setMessages([...messages, ...formattedMessages]);
    //         }
    //     } catch (error) {
    //         console.error("Error loading chat history:", error);
    //         setError("Failed to load chat history");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const clearHistory = async () => {
        if (!currentUser) {
            setMessages([
                { role: "bot", text: "👋 Hi there! I'm your AI travel assistant. How can I help you today?" },
            ]);
            return;
        }

        try {
            await ChatApi.clearChatHistory();
            setMessages([
                { role: "bot", text: "👋 Hi there! I'm your AI travel assistant. How can I help you today?" },
            ]);
        } catch (error) {
            console.error("Error clearing chat history:", error);
            setError("Failed to clear chat history");
        }
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim() || isLoading) return;
    
        const newMessages = [...messages, { role: "user", text: inputText }];
        setMessages(newMessages);
        setInputText("");
        setError(null);
        setIsLoading(true);
    
        try {
            const response = await ChatApi.handleChatRequest({ query: inputText });
    
            if (response.data && response.data.messages && response.data.messages.length > 0) {
                const assistantMessage = response.data.messages.find(msg => msg.role === 'assistant');
                if (assistantMessage) {
                    setMessages([...newMessages, { role: "bot", text: assistantMessage.content }]);
                }
            } else {
                throw new Error("Invalid response format from server");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setError(true);
            setMessages([
                ...newMessages,
                {
                    role: "bot",
                    text: "Sorry, I encountered an error. Please try again or contact support if the problem persists."
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="flex h-screen font-sans">
            {/* Sidebar */}
            <div
                className={`bg-gradient-to-b from-[#0f172a] to-[#334155] text-white flex flex-col justify-between transition-all duration-300 ease-in-out ${
                    isOpen ? "w-64" : "w-16"
                } p-4 shadow-lg rounded-tr-2xl`}>
                <div>
                    <div className={`flex justify-end mb-4 ${isOpen ? "pr-2" : ""}`}>
                        <button
                            onClick={toggleSidebar}
                            className="p-3 text-white rounded-full focus:outline-none hover:bg-[#475569] transition-transform duration-200 ease-in-out transform hover:scale-110">
                            <FontAwesomeIcon icon={isOpen ? faArrowLeft : faArrowRight} />
                        </button>
                    </div>

                    {/* Profile section */}
                    {currentUser && (
                        <div className="flex items-center space-x-4 mb-6">
                            <img
                                src={currentUser.avatar}
                                alt="Profile"
                                className={`rounded-full w-12 h-12 transition-opacity ${
                                    isOpen ? "opacity-100" : "opacity-0"
                                }`}
                            />
                            {isOpen && (
                                <h2 className="font-bold text-lg text-gray-200 truncate max-w-[150px]">
                                    {currentUser.profile?.firstName || currentUser.email}
                                </h2>
                            )}
                        </div>
                    )}

                    <nav className="flex flex-col space-y-4 w-full">
                        <a
                            href="#home"
                            className="text-gray-400 hover:text-white flex items-center px-2 py-2 rounded-md transition-all hover:bg-[#475569] hover:scale-105">
                            <FontAwesomeIcon icon={faHouse} />
                            {isOpen && <span className="ml-4">Home</span>}
                        </a>
                        <a
                            href="#chats"
                            className="text-gray-400 hover:text-white flex items-center px-2 py-2 rounded-md transition-all hover:bg-[#475569] hover:scale-105">
                            <FontAwesomeIcon icon={faMessage} />
                            {isOpen && <span className="ml-4">Chats</span>}
                        </a>
                        <a
                            href="#hotels"
                            className="text-gray-400 hover:text-white flex items-center px-2 py-2 rounded-md transition-all hover:bg-[#475569] hover:scale-105">
                            <FontAwesomeIcon icon={faBed} />
                            {isOpen && <span className="ml-4">Hotels</span>}
                        </a>

                        {isOpen && (
                            <>
                                <button 
                                    onClick={() => setMessages([{ role: "bot", text: "How can I help you today?" }])}
                                    className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md shadow-md transition-transform hover:scale-105">
                                    New Chat
                                </button>
                                <button 
                                    onClick={clearHistory}
                                    className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded-md shadow-md transition-transform hover:scale-105">
                                    Clear History
                                </button>
                            </>
                        )}
                    </nav>
                </div>

                <div className="w-full">
                    {/* Sign In Section */}
                    {!currentUser && isOpen && (
                        <div className="bg-[#1e293b] p-4 rounded-md mt-6 shadow-sm w-full text-center">
                            <p className="text-gray-300 text-sm mb-4">
                                Sign in to save your chats and access all the
                                features of our platform.
                            </p>
                            <button 
                                className="flex items-center justify-center bg-white text-gray-900 px-4 py-2 rounded-full shadow hover:bg-gray-100 transition-all mx-auto"
                                onClick={() => navigate("/sign-in")}>
                                <FontAwesomeIcon
                                    icon={faGoogle}
                                    className="mr-2 text-red-500"
                                />
                                Sign in to save
                            </button>
                        </div>
                    )}

                    <div className="flex items-center justify-between w-full mt-6 px-1">
                        <FontAwesomeIcon icon={faUser} className="w-6 h-6" />
                        {isOpen && (
                            <FontAwesomeIcon
                                icon={faEllipsisH}
                                className="w-6 h-6"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1">
                <div className="w-1/2 flex flex-col justify-between p-8">
                    <div className="bg-white shadow-lg rounded-lg flex flex-col justify-between w-full h-full">
                        {/* Chat Messages */}
                        <div className="flex-1 overflow-auto p-6 space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`p-4 rounded-lg shadow-sm w-max max-w-md ${
                                        message.role === "user"
                                            ? "bg-gray-100 ml-auto"
                                            : "bg-blue-100"
                                    }`}>
                                    <p className={`${
                                        message.role === "user"
                                            ? "text-gray-600"
                                            : "text-blue-600"
                                    }`}>
                                        {message.text}
                                    </p>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-center space-x-2 p-4">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="px-6 py-2">
                                <p className="text-red-500 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Chat Input */}
                        <div className="flex items-center border border-gray-300 p-4 shadow-sm w-full">
                            <input
                                type="text"
                                placeholder="Ask anything..."
                                value={inputText}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                className="flex-1 border-none focus:outline-none text-gray-600 placeholder-gray-400 bg-transparent"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={isLoading || !inputText.trim()}
                                className={`${
                                    isLoading || !inputText.trim()
                                        ? "bg-gray-400"
                                        : "bg-blue-600 hover:bg-blue-700"
                                } text-white px-4 py-2 rounded-lg transition`}>
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-1/2 flex flex-col p-8">
                    {/* Hero Image Section */}
                    <div
                        className="relative w-full h-full bg-cover bg-center rounded-lg shadow-lg"
                        style={{
                            backgroundImage: `url(${heroImage})`,
                        }}>
                        <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
                        <div className="flex items-center justify-center h-full">
                            <h2 className="text-white text-4xl font-bold relative z-10">
                                Discover Your Next Adventure
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;