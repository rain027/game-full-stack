import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import { register, login } from './controllers/authController.js'
import { getGames, getGameById, createGame, updateGame, deleteGame, rateGame } from './controllers/gameController.js'
import { auth } from './middleware/authMiddleware.js'
import Game from './models/Game.js'
import User from './models/User.js'
import Order from './models/Order.js'

dotenv.config()
const app = express()

// More permissive CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err))

// Auth routes
app.post('/api/auth/register', register)
app.post('/api/auth/login', login)

// Game routes
app.get('/api/games', getGames)
app.get('/api/games/:id', getGameById)
app.post('/api/games', auth, createGame)
app.put('/api/games/:id', auth, updateGame)
app.delete('/api/games/:id', auth, deleteGame)
app.post('/api/games/:id/rate', auth, rateGame)

// Developer routes
app.post('/api/developers/upload', auth, createGame)
app.get('/api/developers/mygames', auth, async (req, res) => {
  try {
    console.log("My Games route - Developer:", req.developer)
    if (!req.developer) {
      return res.status(403).json({ msg: 'Access denied - developers only' })
    }
    const games = await Game.find({ developerId: req.developer._id })
    console.log("Found games:", games.length)
    res.json(games)
  } catch (err) {
    console.error("Error fetching developer games:", err)
    res.status(500).json({ msg: err.message })
  }
})

// User Wishlist routes
app.get('/api/users/wishlist', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ msg: 'Access denied - users only' })
    }
    const user = await User.findById(req.user._id).populate('wishlist')
    res.json(user.wishlist)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

app.post('/api/users/wishlist/:gameId', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ msg: 'Access denied - users only' })
    }
    const user = await User.findById(req.user._id)
    if (!user.wishlist.includes(req.params.gameId)) {
      user.wishlist.push(req.params.gameId)
      await user.save()
    }
    res.json({ msg: 'Added to wishlist' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

app.delete('/api/users/wishlist/:gameId', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ msg: 'Access denied - users only' })
    }
    const user = await User.findById(req.user._id)
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.gameId)
    await user.save()
    res.json({ msg: 'Removed from wishlist' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// User Cart routes
app.get('/api/users/cart', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ msg: 'Access denied - users only' })
    }
    const user = await User.findById(req.user._id).populate('cart')
    res.json(user.cart)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

app.post('/api/users/cart/:gameId', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ msg: 'Access denied - users only' })
    }
    const user = await User.findById(req.user._id)
    if (!user.cart.includes(req.params.gameId)) {
      user.cart.push(req.params.gameId)
      await user.save()
    }
    res.json({ msg: 'Added to cart' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

app.delete('/api/users/cart/:gameId', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ msg: 'Access denied - users only' })
    }
    const user = await User.findById(req.user._id)
    user.cart = user.cart.filter(id => id.toString() !== req.params.gameId)
    await user.save()
    res.json({ msg: 'Removed from cart' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// User Library routes
app.get('/api/users/library', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ msg: 'Access denied - users only' })
    }
    const user = await User.findById(req.user._id).populate('library')
    res.json(user.library)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// Purchase route (checkout)
app.post('/api/users/purchase', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({ msg: 'Access denied - users only' })
    }
    const user = await User.findById(req.user._id).populate('cart')
    
    if (user.cart.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' })
    }
    
    // Move games from cart to library
    user.library = [...new Set([...user.library, ...user.cart])]
    
    // Calculate total
    const total = user.cart.reduce((sum, game) => sum + (game.price || 0), 0)
    
    // Create order
    await Order.create({
      userId: user._id,
      games: user.cart,
      totalAmount: total
    })
    
    // Clear cart
    user.cart = []
    await user.save()
    
    res.json({ msg: 'Purchase successful', totalAmount: total })
  } catch (err) {
    console.error("Purchase error:", err)
    res.status(500).json({ msg: err.message })
  }
})

// Test routes
app.get('/', (req, res) => res.send('✅ Indie Vault API Running'))
app.get('/api/test', (req, res) => res.json({ message: 'API is working!' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
})