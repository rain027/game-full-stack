import { Router } from 'express'
import { auth } from '../middleware/authMiddleware.js'
import { getGames, getGameById, createGame, updateGame, deleteGame, rateGame } from '../controllers/gameController.js'

const router = Router()

router.get('/', getGames)
router.get('/:id', getGameById)
router.post('/', auth, createGame)
router.put('/:id', auth, updateGame)
router.delete('/:id', auth, deleteGame)
router.post('/:id/rate', auth, rateGame)

export default router