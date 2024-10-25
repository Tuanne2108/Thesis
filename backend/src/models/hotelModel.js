const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: String,
  price: Number,
  rating: Number
});

module.exports = mongoose.model('Hotel', hotelSchema);