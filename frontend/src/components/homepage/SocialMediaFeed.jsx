import React from 'react';

export const SocialMediaFeed = () => {
  const images = [
    'https://via.placeholder.com/200',
    'https://via.placeholder.com/200',
    'https://via.placeholder.com/200',
    'https://via.placeholder.com/200',
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Follow Us on Instagram
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Instagram post ${index + 1}`}
              className="w-full h-48 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="https://instagram.com/yourbrand"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded transition"
          >
            Follow Us
          </a>
        </div>
      </div>
    </section>
  );
};

