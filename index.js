import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import sleepRoutes from './src/routes/sleep.js'
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors'
import userRoutes from './src/routes/users.js'

const app = express()

dotenv.config({ path: "./.env" })

app.use(cors('*'));

app.use(bodyParser.urlencoded({
        extended: false
}));

app.use(bodyParser.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var publicPath = path.join(__dirname, 'public', 'build');

app.use(express.static(publicPath));

const rootRouter = express.Router();
app.use('/sleep', sleepRoutes)
app.use('/user', userRoutes)
app.use('/user', userRoutes)
rootRouter.get('(/*)?', async (req, res, next) => {
        res.sendFile(path.join(publicPath, 'index.html'));
});
app.use(rootRouter);

const PORT = process.env.PORT || 5000
const host = '0.0.0.0'

let server = app.listen(PORT, host, () => console.log(`Server running on port ${PORT}`))

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => server)
        .catch((error) => console.log(error.message))

export default server