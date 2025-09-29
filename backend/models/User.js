import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  library: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  role: { type: String, default: 'user' }
});

export default mongoose.model('User', UserSchema);