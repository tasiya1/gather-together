
// через хттп
/*
const http = require('http')
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});

    res.write('<h1>TRSPO 2 LABA! not hehe</h1>');
    res.end();
});
*/
/*
const port = 3000;
server.listen(port, () => {
    console.log('Node server is running on ${port}');
})
*/

//через експрес
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'userPictures/')
    }, 
    filename: (req, file, cb) => {
        cb(null, file.originalname + Date.now)
    }
})
const uploadMachine = multer({storage: storage})

app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.get('/', (req, res) => {
    //res.send('<h1>Hello my crappy server!</h1>');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const usersRoute = require('./routes/users')
const roomsRoute = require('./routes/rooms')

app.use('/users', usersRoute)
app.use('/rooms', roomsRoute)

app.post('/sendtime', (req, res) => {
    const requestData = req.body
    console.log(requestData);
    res.json({ message: 'Data received successfully' });
});

app.get('/register', (req, res) => {
    const requestData = req.body
    console.log(requestData);
    res.json({ message: 'Data received successfully' });
});

app.get('/login', (req, res) => {
    const requestData = req.body
    console.log(requestData);
    res.json({ message: 'Data received successfully' });
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Node server is running on ${port}`);
});

