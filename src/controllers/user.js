import bcrypt from 'bcrypt'

import User from '../models/user.js'

export const signin = async (req, res) => {
    
    try {
        const body = req.body
        const existingUser = await User.findOne({ email: body.email })

        if(!existingUser) return res.status(404).json({ message: 'User doesnt exist'})

        const isPasswordCorrent = await bcrypt.compare(body.password, existingUser.password)

        if(!isPasswordCorrent) return res.status(400).json({ message: 'Invalid Credentials'})


        res.status(200).json({result: existingUser})
    } catch (error) {
        res.status(500).json({message: error})
    }
}

export const signup = async (req, res) => {
    
    try {
        const body = req.body
        const existingUser = await User.findOne({email: body.email})
        if(existingUser) return res.status(400).json({ message: 'User already exists'})

        if(body.password !== body.confirmPassword) return res.status(400).json({ message: 'Passwords dont match'})

        const hashedPassoword = await bcrypt.hash(body.password, 12)

        const result = await User.create({ email: body.email, password: hashedPassoword, name: `${body.firstName} ${body.lastName}`})

        res.status(200).json({result})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}