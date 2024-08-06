import React from 'react';

export const SpecialOffers = () => {
  const offers = [
    {
      id: 1,
      title: 'Summer Sale: Up to 50% Off',
      description: 'Get ready for summer with our exclusive discounts.',
      image: 'https://via.placeholder.com/200',
      link: '/shop/summer-sale',
    },
    {
      id: 2,
      title: 'Buy One, Get One Free',
      description: 'Limited time offer on select shoe styles.',
      image: 'https://via.placeholder.com/200',
      link: '/shop/bogo',
    },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Special Offers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="flex flex-col md:flex-row items-center p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full md:w-48 h-48 object-cover rounded-lg mb-4 md:mb-0 md:mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-700">{offer.title}</h3>
                <p className="text-gray-600 mt-2">{offer.description}</p>
                <a
                  href={offer.link}
                  className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded transition"
                >
                  Shop Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

