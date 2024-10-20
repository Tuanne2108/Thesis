const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  embedding: [Number],
});

module.exports = mongoose.model('Document', documentSchema);