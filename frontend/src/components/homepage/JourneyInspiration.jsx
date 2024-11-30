import React from 'react';
import tokyoImage from '../../assets/tokyo.jpg';
import vinhHaLong from '../../assets/vinhhalong.webp';
import romeImage from '../../assets/rome.webp';
import switzerland from '../../assets/switzerland.jpg';

export const JourneyInspiration = () => {
    const trips = [
        {
            name: 'Ivanne Mora',
            title: 'Trip to Tokyo',
            description: 'Join me on an exciting 10-day journey through Tokyo, where we\'ll visit iconic landmarks, indulge in delicious cuisine...',
            image: tokyoImage,
        },
        {
            name: 'Pablo Guzman',
            title: 'Trip to New York',
            description: 'Experience the best of New York City in just 7 days! Explore iconic landmarks, indulge in delicious meals, and immerse...',
            image: vinhHaLong,
        },
        {
            name: 'John Mathew',
            title: 'Trip to Dubai',
            description: 'Embark on a thrilling 6-day journey through Dubai, United Arab Emirates. Explore vibrant souks, iconic landmarks...',
            image: switzerland,
        },
        {
            name: 'Rosarinho Alves',
            title: 'Trip to Rome',
            description: 'Join me on a thrilling 5-day adventure in Rome, where we\'ll explore ancient ruins, marvel at stunning architecture, and...',
            image: romeImage,
        },
    ];

    return (
        <section className="py-16 bg-green-50">
            <h2 className="text-4xl font-extrabold text-center tracking-wide mb-8">Journey Inspirations from Travelers</h2>
            <p className="text-center text-gray-600 text-lg mb-12">
                Dive into unique <a href="#!" className="text-indigo-600 hover:underline">trip itineraries</a> crafted by our global travelers. Find your next adventure and share your own journey with fellow explorers.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 lg:px-16">
                <div className="space-y-8">
                    {trips.slice(0, 2).map((trip, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500">
                            <div 
                                className="h-96 bg-cover bg-center group-hover:opacity-75 transition-opacity duration-300" 
                                style={{ backgroundImage: `url(${trip.image})` }}
                            ></div>

                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="text-center text-white px-4">
                                    <h3 className="text-3xl font-bold">{trip.title}</h3>
                                    <p className="mt-2 text-lg italic">{trip.name}</p>
                                    <p className="mt-4 text-sm">{trip.description}</p>
                                </div>
                            </div>

                            <div className="p-6 absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent text-white">
                                <h3 className="text-2xl font-semibold">{trip.title}</h3>
                                <p className="text-md">{trip.name}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-8">
                    {trips.slice(2, 4).map((trip, index) => (
                        <div key={index} className="relative group rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500">
                            <div 
                                className="h-96 bg-cover bg-center group-hover:opacity-75 transition-opacity duration-300" 
                                style={{ backgroundImage: `url(${trip.image})` }}
                            ></div>

                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="text-center text-white px-4">
                                    <h3 className="text-3xl font-bold">{trip.title}</h3>
                                    <p className="mt-2 text-lg italic">{trip.name}</p>
                                    <p className="mt-4 text-sm">{trip.description}</p>
                                </div>
                            </div>

                            <div className="p-6 absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent text-white">
                                <h3 className="text-2xl font-semibold">{trip.title}</h3>
                                <p className="text-md">{trip.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
