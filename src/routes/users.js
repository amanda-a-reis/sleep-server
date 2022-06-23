import express from 'express'
import { signin, signup } from '../controllers/user.js'
import cors from 'cors'

const router = express.Router()

router.post('/signin', cors(),  signin)
router.post('/signup', cors(), signup)


export default router