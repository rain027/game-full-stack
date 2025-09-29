import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Developer from '../models/Developer.js'

export const auth = async (req, res, next) => {
  let token = req.headers['authorization']
  
  console.log("Auth middleware - received token:", token) // Debug log
  
  if (!token) {
    console.log("No token provided")
    return res.status(401).json({ msg: 'No token provided' })
  }

  // Remove "Bearer " prefix if it exists
  if (token.startsWith('Bearer ')) {
    token = token.slice(7)
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Decoded token:", decoded) // Debug log
    
    if (decoded.role === 'user') {
      req.user = await User.findById(decoded.id)
      console.log("User found:", req.user?.name)
    }
    if (decoded.role === 'developer') {
      req.developer = await Developer.findById(decoded.id)
      console.log("Developer found:", req.developer?.name)
    }
    if (decoded.role === 'admin') {
      req.admin = { id: decoded.id }
    }
    
    next()
  } catch (err) {
    console.log("Token verification failed:", err.message)
    res.status(401).json({ msg: 'Invalid token' })
  }
}

export const roleCheck = (roles) => (req, res, next) => {
  if (roles.includes(req.user?.role) || roles.includes(req.developer?.role) || roles.includes(req.admin?.role)) {
    next()
  } else {
    res.status(403).json({ msg: 'Access denied' })
  }
}