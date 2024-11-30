import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  embedding: [Number],
});

const Document = mongoose.model('Document', documentSchema);

export default Document;
