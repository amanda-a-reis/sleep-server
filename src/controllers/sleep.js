import mongoose from 'mongoose'
import Sleep from '../models/sleep.js'

export const createSleep = async (req, res) => {
    try {
        const sleep = req.body
        const newSleep = new Sleep({ date: sleep.data.date, sleepHour: sleep.data.sleepHour, wakeUpHour: sleep.data.wakeUpHour, user: sleep.data.idUser })
        await newSleep.save()
        
        res.status(201).json(newSleep)
    } catch (error) {
        res.status(409).json({ message: error.message })
    }
}

export const getSleep = async (req, res) => {
    try {
        console.log('antes')
        const sleep = await Sleep.find().sort({ "date": -1 })
        console.log('teste', sleep)

        const newSleep = sleep.map(data => {
            return calculateSleep(data)
        })
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

    hour = (hour + minutes / 60).toFixed(2)

    return { date: data.date, sleepHour: data.sleepHour, wakeUpHour: data.wakeUpHour, hour, user: data.user }
}
