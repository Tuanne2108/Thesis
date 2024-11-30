import React from 'react';

export const CustomizedItineraries = () => {
    return (
        <section className="py-16 bg-indigo-50">
            <div className="text-center">
                <h2 className="text-4xl font-bold">
                    Customized <span className="text-indigo-600">Itineraries</span> for Every Travel Dream
                </h2>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                    Trip Planner AI is your ultimate companion for any travel scenario. Whether it's a solo adventure, a family vacation, or a group expedition, our app tailors every aspect of your journey. Experience the convenience of:
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 px-4 lg:px-16">
                <div className="text-center p-8 bg-gray-50 shadow-md rounded-lg hover:shadow-lg transition duration-300">
                    <h3 className="text-lg font-semibold text-purple-600 mb-2">AI-Powered Route Optimization</h3>
                    <p className="text-gray-600 text-sm">
                        Utilize AI for <strong>optimal travel routes</strong>. Our app ensures a seamless journey, calculating the best paths, travel times, and distances for city tours or cross-country road trips.
                    </p>
                </div>

                <div className="text-center p-8 bg-gray-50 shadow-md rounded-lg hover:shadow-lg transition duration-300">
                    <h3 className="text-lg font-semibold text-purple-600 mb-2">All-in-One Travel Organizer</h3>
                    <p className="text-gray-600 text-sm">
                        Simplify travel planning with our all-in-one platform. Trip Planner AI consolidates hotel and flight details, manages bookings, and imports tips and guides. Organize all trip details in one place.
                    </p>
                </div>

                <div className="text-center p-8 bg-gray-50 shadow-md rounded-lg hover:shadow-lg transition duration-300">
                    <h3 className="text-lg font-semibold text-purple-600 mb-2">Collaborative Group Planning Made Easy</h3>
                    <p className="text-gray-600 text-sm">
                        Collaborate on itineraries with companions. Our real-time feature makes group travel planning effortless, ensuring everyone stays informed and involved in the process.
                    </p>
                </div>
            </div>
        </section>
    );
};
