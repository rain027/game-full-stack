const Game = require('../models/Game');

exports.getGames = async (req, res) => {
  const { genre, tags, rating, search } = req.query;
  const filter = {};
  if (genre) filter.genre = genre;
  if (tags) filter.tags = { $in: tags.split(',') };
  if (rating) filter.rating = { $gte: Number(rating) };
  if (search) filter.title = { $regex: search, $options: 'i' };
  const games = await Game.find(filter).populate('developerId', 'name');
  res.json(games);
};

exports.getGameById = async (req, res) => {
  const game = await Game.findById(req.params.id).populate('developerId', 'name');
  res.json(game);
};

exports.createGame = async (req, res) => {
  const game = await Game.create({ ...req.body, developerId: req.developer._id });
  res.json(game);
};

exports.updateGame = async (req, res) => {
  const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(game);
};

exports.deleteGame = async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Game deleted' });
};

exports.rateGame = async (req, res) => {
  const { rating } = req.body;
  const game = await Game.findById(req.params.id);
  game.rating = ((game.rating * game.reviewsCount) + rating) / (game.reviewsCount + 1);
  game.reviewsCount += 1;
  await game.save();
  res.json(game);
};
