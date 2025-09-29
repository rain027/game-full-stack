const mongoose = require('mongoose');
const DeveloperSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
  role: { type: String, default: 'developer' }
});
module.exports = mongoose.model('Developer', DeveloperSchema);
