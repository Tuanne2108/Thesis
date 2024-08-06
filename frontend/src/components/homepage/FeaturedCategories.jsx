import React from 'react';

export const FeaturedCategories = () => {
  const categories = [
    {
      name: 'Sneakers',
      image: 'https://via.placeholder.com/150', // Replace with your image URL
      description: 'Stylish and comfortable sneakers for everyday wear.',
    },
    {
      name: 'Boots',
      image: 'https://via.placeholder.com/150', // Replace with your image URL
      description: 'Durable boots for all terrains and weather.',
    },
    {
      name: 'Formal',
      image: 'https://via.placeholder.com/150', // Replace with your image URL
      description: 'Elegant formal shoes for special occasions.',
    },
    {
      name: 'Sports',
      image: 'https://via.placeholder.com/150', // Replace with your image URL
      description: 'Performance shoes for sports and athletics.',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-32 h-32 object-cover mb-4 rounded-full"
              />
              <h3 className="text-xl font-semibold text-gray-700">
                {category.name}
              </h3>
              <p className="text-gray-600 mt-2">{category.description}</p>
              <a
                href={`/shop/${category.name.toLowerCase()}`}
                className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded transition"
              >
                Shop {category.name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

