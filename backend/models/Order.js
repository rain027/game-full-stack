import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  totalAmount: Number,
  purchaseDate: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);