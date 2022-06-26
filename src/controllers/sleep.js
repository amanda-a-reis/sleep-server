import mongoose from 'mongoose'
import Sleep from '../models/sleep.js'

export const createSleep = async (req, res) => {
    try {
        const sleep = req.body
        const hour = calculateSleep(sleep.data)

        const newSleep = new Sleep({ date: sleep.data.date, sleepHour: sleep.data.sleepHour, wakeUpHour: sleep.data.wakeUpHour, user: sleep.data.user, hour })
        await newSleep.save()
        
        res.status(201).json(newSleep)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const getSleep = async (req, res) => {
    try {

        const queryObj = {...req.query}

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        
        const query = Sleep.find(JSON.parse(queryStr)).sort({date: -1})

        query = Sleep.find(req.query.user)
        
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 100
        const skip = (page - 1) * limit

        query.skip(skip).limit(limit)

        if(req.query.page) {
            const numSleeps = await Sleep.countDocuments()
            if(skip >= numSleeps) throw new Error('This page does not exist')
        }
        
        const newSleep = await query

       return res.status(200).json(newSleep)
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
}

export function calculateSleep(data) {
    let newSleepHour = data.sleepHour.split(":")

    let newWakeUpHour = data.wakeUpHour.split(":")
    let hour
    if (Number(newSleepHour[0]) === 0) {
        hour = Number(newWakeUpHour[0])
    } else if (Number(newWakeUpHour[0]) >= Number(newSleepHour[0])) {
        hour = Number(newWakeUpHour[0]) - Number(newSleepHour[0])
    } else {
        hour = (24 - Number(newSleepHour[0])) + Number(newWakeUpHour[0])
    }
    let minutes
    if (newSleepHour[1] !== 0) {
        minutes = (Number(newWakeUpHour[1]) - Number(newSleepHour[1]))
    } else {
        minutes = (Number(newSleepHour[1]) + Number(newWakeUpHour[1]))
    }

    if (minutes < 0)
        minutes * -1

    hour = (hour + minutes / 60).toFixed(0)

    return hour
}
