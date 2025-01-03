import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebook,
    faInstagram,
    faYoutube,
    faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export const Footer = () => {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e) => {
        e.preventDefault();
        console.log("Subscribed with email:", email);
    };

    return (
        <footer className="bg-gray-900 text-gray-400 py-12">
            <div className="container mx-auto px-4">
                {/* Footer Sections */}
                <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16">
                    {/* Logo */}
                    <div className="mb-8 flex justify-center">
                        <svg
                            className="w-10 h-10 text-indigo-500"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path d="M12 0L15.09 8.26H23.635L17.27 13.47L19.635 21.635L12 16.27L4.365 21.635L6.73 13.47L0.365 8.26H8.91L12 0Z" />
                        </svg>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-wrap justify-center space-x-12">
                        <div>
                            <h4 className="text-white text-lg font-bold mb-4">
                                Support
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition">
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white text-lg font-bold mb-4">
                                Itineraries
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition">
                                        Community Trips
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition">
                                        Find Destinations
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white text-lg font-bold mb-4">
                                Legal
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition">
                                        Terms and Conditions
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-white transition">
                                        Privacy Policy
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-8 text-center">
                    <h4 className="text-white text-lg font-bold mb-4">
                        Subscribe to our newsletter
                    </h4>
                    <p className="mb-4 text-gray-400">
                        The latest news, articles, and resources, sent to your
                        inbox weekly.
                    </p>
                    <form
                        onSubmit={handleSubscribe}
                        className="flex flex-col md:flex-row justify-center items-center gap-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full md:w-1/3 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-md transition">
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Social Media Icons */}
                <div className="flex justify-center space-x-6 mt-8">
                    <a href="#" className="hover:text-white transition">
                        <FontAwesomeIcon icon={faFacebook} className="mr-2" />
                    </a>
                    <a href="#" className="hover:text-white transition">
                        <FontAwesomeIcon icon={faInstagram} className="mr-2" />
                    </a>
                    <a href="#" className="hover:text-white transition">
                        <FontAwesomeIcon icon={faXTwitter} className="mr-2" />
                    </a>
                    <a href="#" className="hover:text-white transition">
                        <FontAwesomeIcon icon={faYoutube} className="mr-2" />
                    </a>
                </div>

                {/* Copyright */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; 2024 Your Company, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
