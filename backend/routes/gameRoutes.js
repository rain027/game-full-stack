const router = require('express').Router();
const { auth } = require('../middleware/authMiddleware');
const { getGames, getGameById, createGame, updateGame, deleteGame, rateGame } = require('../controllers/gameController');

router.get('/', getGames);
router.get('/:id', getGameById);
router.post('/', auth, createGame);
router.put('/:id', auth, updateGame);
router.delete('/:id', auth, deleteGame);
router.post('/:id/rate', auth, rateGame);

module.exports = router;
