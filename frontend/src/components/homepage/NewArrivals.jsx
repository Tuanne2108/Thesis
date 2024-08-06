/* eslint-disable react/prop-types */
import React from 'react';

export const NewArrivals = ({ products }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          New Arrivals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center text-center p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-32 h-32 object-cover mb-4 rounded-lg"
              />
              <h3 className="text-xl font-semibold text-gray-700">{product.name}</h3>
              <p className="text-gray-600 mt-2">${product.price}</p>
              <a
                href={`/product/${product.id}`}
                className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded transition"
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

