import jwt from "jsonwebtoken"
import util from 'util'
import User from "../models/user.js"
import { sendEmail } from "../utils/email.js"
import { signToken } from "./user.js"
import crypto from 'crypto'
import bcrypt from 'bcrypt'

export const protect = async (req, res, next) => {

    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        if (!token) {
            return res.status(401).json({ message: 'Você não está logado. Favor fazer login' })
        }

        const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET)

        const freshUser = await User.findById(decoded.id)

        if (!freshUser) {
            return res.status(401).json({ message: 'O usuário desse token não existe mais' })
        }

        if (freshUser.changePasswordAfter(decoded.iat)) {
            return res.status(401).json({ message: 'O usuário alterou a senha. Faça login novamente' })
        }
        next()

    } catch (error) {
        console.log(error)

    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json({ message: 'O usuário não existe' })
        }
        const resetToken = user.createPasswordResetToken()
        await user.save({ validateBeforeSave: false })

        const resetURL = `${req.protocol}://${req.get('host')}/user/resetPassword/${resetToken}`

        const message = `Esqueceu sua senha? Envie um pedido de alteração com a nova senha e sua confirmação para: ${resetURL}`

        console.log(user.email, message)

        try {
            await sendEmail({
                email: user.email,
                subject: 'Alterar senha (válido por 10 minutos)',
                message: message
            })
        } catch (error) {
            user.passwordResetToken = undefined,
                user.passwordResetExpires = undefined
            await user.save({ validateBeforeSave: false })

            return res.status(500).json({ message: error })
        }

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })

        next()
    } catch (error) {
        console.log(error)
    }

}

export const resetPassword = async (req, res, next) => {

    if (req.body.password !== req.body.passwordConfirm) {
        return res.status(400).json({ message: 'As senhas são diferentes' })
    }

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    console.log(hashedToken)
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: (Date.now() - (180 * 60 * 1000)) }
    })
    if (!user) {
        return res.status(400).json({ message: 'Token invalido ou expirado' })
    }

    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
  
    const validPassword = validator.isStrongPassword(req.body.password)

        if (validPassword) {
            const hashedPassoword = await bcrypt.hash(req.body.password, 12)
            user.password = hashedPassoword
            await user.save()

            const token = signToken(user._id)

            const cookieOptions = {
                expires: new Date((Date.now() - (180 * 60 * 1000)) + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie('jwt', token, cookieOptions)

            result.password = undefined

            res.status(201).json({
                status: 'success',
                token,
            })
        }

}

