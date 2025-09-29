const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Developer = require('../models/Developer');

exports.auth = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'user') req.user = await User.findById(decoded.id);
    if (decoded.role === 'developer') req.developer = await Developer.findById(decoded.id);
    if (decoded.role === 'admin') req.admin = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

exports.roleCheck = (roles) => (req, res, next) => {
  if (roles.includes(req.user?.role) || roles.includes(req.developer?.role) || roles.includes(req.admin?.role)) {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied' });
  }
};
