import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

export const Testimonial = () => {
    const testimonials = [
        {
            name: "David Jordan",
            role: "Digital Nomad",
            review: "Trip Planner AI saves time and stress by aiding travel planning, relieving indecision or uncertainty.",
            rating: 5,
            image: "https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png",
            backgroundColor: "bg-pink-100",
        },
        {
            name: "Tushar",
            role: "Student",
            review: "Trip Planner AI offers diverse planning options in a user-friendly interface. Simplifies travel planning for enthusiasts.",
            rating: 5,
            image: "https://w7.pngwing.com/pngs/4/736/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png",
            backgroundColor: "bg-blue-100",
        },
        {
            name: "Steve J",
            role: "Student",
            review: "I love traveling but hate planning. This app quickly organizes trip agendas, reducing decision fatigue.",
            rating: 5,
            image: "https://w7.pngwing.com/pngs/364/361/png-transparent-account-avatar-profile-user-avatars-icon-thumbnail.png",
            backgroundColor: "bg-green-100",
        },
    ];

    return (
        <section className="py-16 text-center bg-gradient-to-r from-blue-200 to-blue-100">
            <h2 className="text-4xl font-bold mb-8">
                Don't take our word for it
            </h2>
            <p className="text-lg text-gray-600 mb-12">
                See what our users have to say about revolutionizing their
                travel experiences with Trip Planner AI.
            </p>

            <div className="flex flex-wrap justify-center gap-8">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className={`max-w-sm p-6 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 ${testimonial.backgroundColor}`}>
                        <FaQuoteLeft
                            size={30}
                            className="text-purple-500 absolute top-6 left-6"
                        />
                        <div className="flex items-center mb-4">
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <div>
                                <h3 className="text-lg font-bold">
                                    {testimonial.name}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {testimonial.role}
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">
                            {testimonial.review}
                        </p>
                        <div>{"⭐".repeat(testimonial.rating)}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};
