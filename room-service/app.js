
//через експрес
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const verifyToken = require('../auth-service/middlewares/authMiddleware');
const cookieParser = require('cookie-parser');

var url = "mongodb://127.0.0.1:27017/gatherTogether";

mongoose.connect(url, {
}).then(() => {
    console.log("connected lol")
}).catch((error) => {
    console.log(error)
})

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    //res.send('<h1>Hello my crappy server!</h1>');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const roomsRoute = require('./routes/rooms')

app.use('/', verifyToken, roomsRoute)


const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Node server is running on ${port}`);
});

