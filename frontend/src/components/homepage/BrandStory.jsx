import React from "react";

export const BrandStory = () => {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Our Story
                </h2>
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 md:pr-8">
                        <img
                            src="https://via.placeholder.com/400"
                            alt="Brand Story"
                            className="w-full h-full object-cover rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="md:w-1/2 mt-8 md:mt-0">
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Founded in 2024, Shoe Store began with a mission to
                            deliver high-quality, stylish footwear to people all
                            over the world. Our journey started in a small
                            workshop, where we crafted each pair of shoes by
                            hand with utmost care and precision. Over the years,
                            we've grown into a brand recognized for our
                            commitment to quality and customer satisfaction.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            We believe in creating shoes that not only look good
                            but also feel great. Our designs blend timeless
                            elegance with modern aesthetics, ensuring that every
                            pair is both fashionable and functional. Join us as
                            we continue to innovate and bring you the best in
                            footwear.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
