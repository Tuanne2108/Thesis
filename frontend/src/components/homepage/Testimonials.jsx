import React from 'react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: 'John Doe',
      image: 'https://via.placeholder.com/100', // Replace with your image URL
      text: 'The sneakers I bought are amazing! Comfortable and stylish.',
    },
    {
      name: 'Jane Smith',
      image: 'https://via.placeholder.com/100', // Replace with your image URL
      text: 'Excellent quality and fast delivery. I love my new boots!',
    },
    {
      name: 'Mark Wilson',
      image: 'https://via.placeholder.com/100', // Replace with your image URL
      text: 'Great customer service and awesome collection of formal shoes.',
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col items-center text-center p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-24 h-24 object-cover mb-4 rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-700">
                {testimonial.name}
              </h3>
              <p className="text-gray-600 mt-2 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
