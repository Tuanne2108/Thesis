/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import heroImage from "../assets/hero_image.jpeg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const ChatInterface = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const currentUser = useSelector((state) => state.user.currentUser);
    const [showRecommendations, setShowRecommendations] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const triggerRecommendations = () => {
        setShowRecommendations(true);
    };

    return (
        <div className="flex h-screen font-sans">
            {/* Sidebar */}
            <div
                className={`bg-gradient-to-b from-[#0f172a] to-[#334155] text-white flex flex-col justify-between transition-all duration-300 ease-in-out ${
                    isOpen ? "w-64" : "w-16"
                } p-4 shadow-lg rounded-tr-2xl`}>
                <div>
                    <div
                        className={`flex justify-end mb-4 ${
                            isOpen ? "pr-2" : ""
                        }`}>
                        <button
                            onClick={toggleSidebar}
                            className="p-3 text-white rounded-full focus:outline-none hover:bg-[#475569] transition-transform duration-200 ease-in-out transform hover:scale-110">
                            {isOpen ? (
                                <FontAwesomeIcon icon={faArrowLeft} />
                            ) : (
                                <FontAwesomeIcon icon={faArrowRight} />
                            )}
                        </button>
                    </div>

                    {/* Profile section */}
                    {currentUser? (<div className="flex items-center space-x-4 mb-6">
                        <img
                            src={currentUser.avatar}
                            alt="Profile"
                            className={`rounded-full w-12 h-12 transition-opacity ${
                                isOpen ? "opacity-100" : "opacity-0"
                            }`}
                        />
                        {isOpen && (
                            <h2 className="font-bold text-lg text-gray-200">
                                currentUser.name
                            </h2>
                        )}
                    </div>)}

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
                            <button className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded-md mt-6 shadow-md transition-transform hover:scale-105">
                                New Chat
                            </button>
                        )}
                    </nav>
                </div>

                <div className="w-full">
                    {/* Sign In Section */}
                    {isOpen && (
                        <div className="bg-[#1e293b] p-4 rounded-md mt-6 shadow-sm w-full text-center">
                            <p className="text-gray-300 text-sm mb-4">
                                Sign in to save your chats and access all the
                                features of our platform.
                            </p>
                            <button className="flex items-center justify-center bg-white text-gray-900 px-4 py-2 rounded-full shadow hover:bg-gray-100 transition-all mx-auto" onClick={()=>{
                              navigate("/sign-in");
                            }}>
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
                        <div className="flex-1 overflow-auto p-6 space-y-4">
                            <div className="bg-blue-100 p-4 rounded-lg shadow-sm w-max max-w-md">
                                <p className="text-blue-700 text-lg font-semibold">
                                    👋 Hi there! I'm your AI travel assistant.
                                </p>
                                <p className="text-blue-600 mt-1">
                                    I can help you plan your trips. Here are
                                    some things you can ask me:
                                </p>
                            </div>

                            {/* Examples as Chat Bubbles */}
                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm w-max max-w-md ml-auto">
                                <p className="text-gray-600">
                                    🌍 "What are the top places to visit in
                                    Europe?"
                                </p>
                            </div>

                            <div className="bg-blue-100 p-4 rounded-lg shadow-sm w-max max-w-md">
                                <p className="text-blue-600">
                                    ✈️ "How can I plan a budget trip?"
                                </p>
                            </div>

                            <div className="bg-gray-100 p-4 rounded-lg shadow-sm w-max max-w-md ml-auto">
                                <p className="text-gray-600">
                                    👨‍👩‍👧 "Suggest a family vacation destination."
                                </p>
                            </div>
                        </div>

                        {/* Chat Input */}
                        <div className="flex items-center border border-gray-300 p-4 shadow-sm w-full">
                            <input
                                type="text"
                                placeholder="Ask anything..."
                                className="flex-1 border-none focus:outline-none text-gray-600 placeholder-gray-400 bg-transparent"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-1/2 flex flex-col p-8">
                    {/* Dynamic Text with Background Image */}
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
