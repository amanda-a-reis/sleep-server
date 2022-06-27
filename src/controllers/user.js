import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import User from '../models/user.js'
import validator from 'validator'
import jwt from 'jsonwebtoken'

export const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

export const signin = async (req, res) => {

    try {

        const { email, password } = req.body
        const existingUser = await User.findOne({ email: email }).select('+password')

        if (!existingUser) return res.status(404).json({ message: 'User doesnt exist' })


        const isPasswordCorrent = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordCorrent) return res.status(400).json({ message: 'Invalid Credentials' })

        const token = signToken(existingUser._id)

        const cookieOptions = {
            expires: new Date((Date.now() - (180 * 60 * 1000)) + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
            httpOnly: true
        }

        res.cookie('jwt', token, cookieOptions)

        res.status(200).json({
            name: existingUser.name,
            email: existingUser.email,
            id: existingUser._id,
            token
        })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const signup = async (req, res) => {

    try {
        const { firstName, lastName, email, password, confirmPassword, passwordChangedAt } = req.body

        const existingUser = await User.findOne({ email: email })
        if (existingUser) return res.status(400).json({ message: 'User already exists' })

        if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords dont match' })

        const validPassword = validator.isStrongPassword(password)

        if (validPassword) {
            const hashedPassoword = await bcrypt.hash(password, 12)

            const result = await User.create({ email: email, password: hashedPassoword, name: `${firstName} ${lastName}`, passwordChangedAt: passwordChangedAt })

            const token = signToken(result._id)

            const cookieOptions = {
                expires: new Date((Date.now() - (180 * 60 * 1000)) + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie('jwt', token, cookieOptions)

            result.password = undefined

            res.status(201).json({
                status: 'success',
                token,
                data: {
                    user: result
                }
            })
        } else {
            res.status(400).json({ message: 'A senha escolhida é inválida' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user with this ID')

        await User.findByIdAndRemove(id)

        res.json({ message: 'Account deleted successfully' })
    } catch (error) {
        console.log(error)
    }
}