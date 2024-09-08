import React from "react";
import travel1 from "../../assets/travel1.jpg";
import travel2 from "../../assets/travel2.jpg";

export const HowItWorks = () => {
    return (
        <section className="py-12 px-6 md:px-12 text-center bg-gray-100">
            <h2 className="text-4xl font-bold mb-8">
                Your <span className="text-purple-600">AI-Powered</span> Trip
            </h2>

            <div className="flex flex-col md:flex-row justify-center items-start gap-40">
                <div className="flex-1 text-justify max-w-lg">
                    <h3 className="text-2xl font-bold bg-yellow-400 inline-block p-2 mb-4">
                        The most optimal
                    </h3>
                    <p className="text-lg mb-4">
                        Craft your perfect itinerary with Trip Planner AI. Our advanced algorithms take into account your selected explore-sights, dining, and lodging preferences to create the optimal travel plan tailored just for you.
                    </p>
                    <img
                        src={travel1}
                        alt="Optimal Trip"
                        className="w-full h-50 rounded-lg"
                    />
                </div>

                <div className="flex-1 text-justify max-w-lg">
                    <img
                        src={travel2}
                        alt="Inspired Trip"
                        className="w-full h-auto rounded-lg mb-4"
                    />
                    <h3 className="text-2xl font-bold bg-yellow-400 inline-block p-2 mb-4">
                        Get Inspired
                    </h3>
                    <p className="text-lg">
                        Extract valuable travel insights from Instagram reels and TikToks, explore the mentioned explore-sights, and effortlessly include them in your own adventure with Trip Planner AI.
                    </p>
                </div>
            </div>
        </section>
    );
};
