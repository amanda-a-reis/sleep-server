import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import User from '../models/user.js'
import Sleep from '../models/sleep.js'

export const signin = async (req, res) => {

    try {
        const { email, password } = req.body
        const existingUser = await User.findOne({ email: email })

        if (!existingUser) return res.status(404).json({ message: 'User doesnt exist' })

        const isPasswordCorrent = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordCorrent) return res.status(400).json({ message: 'Invalid Credentials' })


        res.status(200).json({ result: existingUser })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const signup = async (req, res) => {

    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body
        console.log('data', req.body)

        const existingUser = await User.findOne({ email: email })
        if (existingUser) return res.status(400).json({ message: 'User already exists' })

        if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords dont match' })

        const hashedPassoword = await bcrypt.hash(password, 12)

        const result = await User.create({ email: email, password: hashedPassoword, name: `${firstName} ${lastName}` })

        res.status(200).json({ result })
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