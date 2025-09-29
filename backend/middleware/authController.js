const User = require('../models/User');
const Developer = require('../models/Developer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    if (role === 'user') {
      const user = await User.create({ name, email, password: hashed, role });
      res.json({ msg: 'User registered', user });
    } else if (role === 'developer') {
      const dev = await Developer.create({ name, email, password: hashed, role });
      res.json({ msg: 'Developer registered', dev });
    } else res.status(400).json({ msg: 'Invalid role' });
  } catch (err) { res.status(400).json({ msg: err.message }); }
};

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const model = role === 'user' ? User : Developer;
    const user = await model.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid password' });
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) { res.status(500).json({ msg: err.message }); }
};
