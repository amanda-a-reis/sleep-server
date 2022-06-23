import mongoose from 'mongoose'

const sleepSchema = mongoose.Schema({
    date: String,
    sleepHour: String,
    wakeUpHour: String,
    user: String
})

export default mongoose.model("Sleep", sleepSchema)