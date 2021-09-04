import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo'

import {
    userRoutes, 
} from './routes/index.js';
import connectToDatabase from './models/index.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.set('view engine', 'ejs');


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, path: '/' },
    // cookie: {httpOnly: false},
    key: 'cookie.sid',
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI})
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    console.log(req.sessionID, req.session, req.body);
    next();
})


const accessLogStream = fs.createWriteStream(path.join(process.cwd(), 'access.log'), { flags: 'a' })
app.use(morgan('combined'))
app.use(morgan('combined', { stream: accessLogStream }))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

app.use((err, req, res, next) => {
    accessLogStream.write(` ${req.method} ${req.path} ${err.message} \n`)
    res.status(500).json({message:"Sorry about that. Maybe try again?"});
})

app.use("/users", userRoutes)

connectToDatabase().then((error) => {
    if (error) {
        console.log(error)
        return process.exit(1)
    }
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`)
    })
})