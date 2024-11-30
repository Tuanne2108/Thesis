import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: String,
  description: String,
  location: String,
  price: Number,
  rating: Number,
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
