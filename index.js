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

const app = express();
app.set('view engine', 'ejs');


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
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
    origin: "http://localhost:3000" // or your netlify domain
}))


// app.use(express.static('public'))

app.use((err, req, res, next) => {
    accessLogStream.write(` ${req.method} ${req.path} ${err.message} \n`)
    res.status(500).send('Something broke!') 
})

app.use("/users", userRoutes)
app.use("/confirm", (req, res) => {
    res.render('confirm', {
        title: "You're almost ready",
        message:"please check your email and click the confirmation link"
    });
})
app.use("/", (req, res) => {
    res.render('index.ejs', {
        title: 'auth test page',
        user: req.session.user,
        sessionID: req.sessionID
    })
})

// app.use("/api", api)

connectToDatabase().then((error) => {
    if (error) {
        console.log(error,"!!!!")
        return process.exit(1)
    }
    app.listen(8080, () => {
        console.log('Server is running on port 8080')
    })
})