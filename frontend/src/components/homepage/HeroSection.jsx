import React from 'react';

export const HeroSection = () => {
  return (
    <section className="relative bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between py-12 px-4">
        {/* Text Content */}
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold mb-4">Step into Style</h1>
          <p className="text-lg mb-6">
            Discover our latest collection of trendy and comfortable shoes.
          </p>
          <a
            href="/shop"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded transition"
          >
            Shop Now
          </a>
        </div>
        {/* Hero Image */}
        <div className="md:w-1/2">
          <img
            src="https://via.placeholder.com/500"
            alt="Featured Shoe"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

