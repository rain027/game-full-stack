import Game from '../models/Game.js'
import mongoose from 'mongoose'

export const getGames = async (req, res) => {
  try {
    const { genre, tags, rating, search } = req.query
    const filter = {}
    if (genre) filter.genre = genre
    if (tags) filter.tags = { $in: tags.split(',') }
    if (rating) filter.rating = { $gte: Number(rating) }
    if (search) filter.title = { $regex: search, $options: 'i' }
    const games = await Game.find(filter).populate('developerId', 'name')
    res.json(games)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate('developerId', 'name')
    if (!game) {
      return res.status(404).json({ msg: 'Game not found' })
    }
    res.json(game)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const createGame = async (req, res) => {
  try {
    if (!req.developer) {
      return res.status(403).json({ msg: 'Only developers can create games' })
    }
    const game = await Game.create({ ...req.body, developerId: req.developer._id })
    res.json(game)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const updateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
    
    if (!game) {
      return res.status(404).json({ msg: 'Game not found' })
    }

    // Check if the developer owns this game
    if (!req.developer || game.developerId.toString() !== req.developer._id.toString()) {
      return res.status(403).json({ msg: 'You can only update your own games' })
    }

    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updatedGame)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
    
    if (!game) {
      return res.status(404).json({ msg: 'Game not found' })
    }

    // Check if the developer owns this game
    if (!req.developer || game.developerId.toString() !== req.developer._id.toString()) {
      return res.status(403).json({ msg: 'You can only delete your own games' })
    }

    // Check if anyone has purchased this game
    const User = mongoose.model('User')
    const purchasedCount = await User.countDocuments({ library: req.params.id })
    
    if (purchasedCount > 0) {
      return res.status(403).json({ 
        msg: `Cannot delete this game. ${purchasedCount} ${purchasedCount === 1 ? 'user has' : 'users have'} already purchased it. Users who purchased it still need access to their content.`,
        purchasedCount 
      })
    }

    // Also check cart and wishlist
    const inCart = await User.countDocuments({ cart: req.params.id })
    const inWishlist = await User.countDocuments({ wishlist: req.params.id })
    
    // Remove from cart and wishlist before deleting
    if (inCart > 0 || inWishlist > 0) {
      await User.updateMany(
        { $or: [{ cart: req.params.id }, { wishlist: req.params.id }] },
        { $pull: { cart: req.params.id, wishlist: req.params.id } }
      )
    }

    // Safe to delete - no one owns it yet
    await Game.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Game deleted successfully' })
  } catch (err) {
    console.error("Delete error:", err)
    res.status(500).json({ msg: err.message })
  }
}

export const rateGame = async (req, res) => {
  try {
    const { rating } = req.body
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ msg: 'Rating must be between 1 and 5' })
    }

    const game = await Game.findById(req.params.id)
    
    if (!game) {
      return res.status(404).json({ msg: 'Game not found' })
    }

    game.rating = ((game.rating * game.reviewsCount) + rating) / (game.reviewsCount + 1)
    game.reviewsCount += 1
    await game.save()
    res.json(game)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}