import express from 'express'
import { createSleep, getSleep, deleteSleep } from '../controllers/sleep.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.post('/', protect, createSleep)
router.get('/', protect,  getSleep)
router.delete('/:id', protect, deleteSleep)

export default router