import Game from '../models/Game.js'

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
    res.json(game)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const createGame = async (req, res) => {
  try {
    const game = await Game.create({ ...req.body, developerId: req.developer._id })
    res.json(game)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(game)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const deleteGame = async (req, res) => {
  try {
    await Game.findByIdAndDelete(req.params.id)
    res.json({ msg: 'Game deleted' })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

export const rateGame = async (req, res) => {
  try {
    const { rating } = req.body
    const game = await Game.findById(req.params.id)
    game.rating = ((game.rating * game.reviewsCount) + rating) / (game.reviewsCount + 1)
    game.reviewsCount += 1
    await game.save()
    res.json(game)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}