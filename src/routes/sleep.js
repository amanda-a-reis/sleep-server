import express from 'express'
import { createSleep, getSleep } from '../controllers/sleep.js'


const router = express.Router()

router.post('/', createSleep)
router.get('/',  getSleep)

export default router