import express from 'express'
import { signin, signup, deleteAccount } from '../controllers/user.js'
import cors from 'cors'
import { protect, forgotPassword, resetPassword } from '../controllers/authController.js'

const router = express.Router()

router.post('/signin', cors(),  signin)
router.post('/signup', cors(), signup)
router.delete('/signin/:id', protect, deleteAccount)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)



export default router