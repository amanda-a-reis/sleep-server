import mongoose from "mongoose";
import validator from 'validator'
import crypto from 'crypto'

const userSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true,
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Email invalido']
    },
    password: { 
        type: String, 
        required: true,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    id: { 
        type: String
    }
})

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = (Date.now() - (180 * 60 * 1000)) - 1000
    next()

})

userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000)

        console.log(this.passwordChangedAt, JWTTimestamp)

        return JWTTimestamp < changedTimestamp
    }
    return false
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    this.passwordResetExpires = (Date.now() - (180 * 60 * 1000)) + 10 * 60 * 1000 

    return resetToken
}

export default mongoose.model("User", userSchema)