import mongoose from 'mongoose';

const GameSchema = new mongoose.Schema({
  title: String,
  description: String,
  genre: String,
  tags: [String],
  price: Number,
  developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer' },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  media: { images: [String], videos: [String] },
  systemRequirements: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Game', GameSchema);