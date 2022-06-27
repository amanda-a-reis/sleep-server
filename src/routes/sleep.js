import express from 'express'
import { createSleep, getSleep, deleteSleep } from '../controllers/sleep.js'


const router = express.Router()

router.post('/', createSleep)
router.get('/',  getSleep)
router.delete('/:id', deleteSleep)

export default router