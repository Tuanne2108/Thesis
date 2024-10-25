const Hotel = require('../models/hotelModel');

async function getAllHotels() {
  return await Hotel.find();
}

async function getHotelsByLocation(location) {
  return await Hotel.find({ location: new RegExp(location, 'i') });
}

module.exports = { getAllHotels, getHotelsByLocation };