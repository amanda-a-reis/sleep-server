import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import sleepRoutes from './src/routes/sleep.js'
import cors from 'cors'
import userRoutes from './src/routes/users.js'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'

const app = express()
app.use(helmet())
const limiter = rateLimit({
        max: 100,
        windowMs: 60 * 60 * 1000,
        message: 'Muitos requests desse IP, tente novamente em uma hora'
})
app.use('/', limiter)

dotenv.config({ path: "./.env" })

app.use(cors('*'));
app.use(morgan("dev"))

app.use(bodyParser.urlencoded({
        extended: false
}));
app.use(bodyParser.json());

app.use(ExpressMongoSanitize())
app.use(xss())
app.use(hpp())

app.use('/sleep', sleepRoutes)
app.use('/user', userRoutes)

const PORT = process.env.PORT || 5000
const host = '0.0.0.0'

let server = app.listen(PORT, host, () => console.log(`Server running on port ${PORT}`))

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => server)
        .catch((error) => console.log(error.message))

export default server