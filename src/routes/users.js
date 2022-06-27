import express from 'express'
import { signin, signup, deleteAccount } from '../controllers/user.js'
import cors from 'cors'

const router = express.Router()

router.post('/signin', cors(),  signin)
router.post('/signup', cors(), signup)
router.delete('/signin/:id', cors(), deleteAccount)

export default router