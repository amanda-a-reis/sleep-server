import mongoose from 'mongoose'

const sleepSchema = mongoose.Schema({
    date: {
        type: String, 
        required: true
    },
    sleepHour: {
        type: String, 
        required: true
    },
    wakeUpHour: {
        type: String, 
        required: true
    },
    user: {
        type: String, 
        required: true
    },
    hour: Number
})

export default mongoose.model("Sleep", sleepSchema)