import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import { register, login } from './controllers/authController.js'
import { getGames, getGameById, createGame, updateGame, deleteGame, rateGame } from './controllers/gameController.js'
import { auth } from './middleware/authMiddleware.js'

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

// Test routes
app.get('/', (req, res) => res.send('✅ Indie Vault API Running'))
app.get('/api/test', (req, res) => res.json({ message: 'API is working!' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
})