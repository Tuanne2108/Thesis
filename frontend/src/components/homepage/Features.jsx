import React from "react";
import { FaRoute, FaUserEdit, FaUtensils } from "react-icons/fa";

export const Features = () => {
    return (
        <section className="py-12 text-center bg-white">
            <h2 className="text-4xl font-bold mb-6">
                The only tool you'll ever need!
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto mb-12">
                Say goodbye to the stress of planning and hello to personalized recommendations,
                efficient itineraries, and seamless dining experiences.
            </p>

            <div className="flex justify-center flex-wrap gap-8">
                <div className="flex-1 max-w-xs bg-white p-8 rounded-lg shadow-lg text-left transition-transform transform hover:scale-105">
                    <FaRoute size={50} className="text-purple-600 mb-4" />
                    <h3 className="text-2xl font-bold mb-4">
                        Optimal Route Planning
                    </h3>
                    <p className="text-gray-600">
                        Our AI algorithms analyze your preferences to craft the most efficient route,
                        saving you time and effort.
                    </p>
                </div>

                <div className="flex-1 max-w-xs bg-white p-8 rounded-lg shadow-lg text-left transition-transform transform hover:scale-105">
                    <FaUserEdit size={50} className="text-purple-600 mb-4" />
                    <h3 className="text-2xl font-bold mb-4">
                        Personalize Your Adventure
                    </h3>
                    <p className="text-gray-600">
                        Shape your journey by freely adding, editing, or deleting activities from your
                        itinerary.
                    </p>
                </div>

                <div className="flex-1 max-w-xs bg-white p-8 rounded-lg shadow-lg text-left transition-transform transform hover:scale-105">
                    <FaUtensils size={50} className="text-purple-600 mb-4" />
                    <h3 className="text-2xl font-bold mb-4">
                        Local Cuisine Recommendations
                    </h3>
                    <p className="text-gray-600">
                        Discover local cuisines and hidden gems recommended by our AI, tailored to your
                        taste buds.
                    </p>
                </div>
            </div>
        </section>
    );
};
