
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
const User = require('./models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const verifyToken = require('./middlewares/authMiddleware');
const cookieParser = require('cookie-parser');

var url = "mongodb://127.0.0.1:27017/gatherTogether";

mongoose.connect(url, {
}).then(() => {
    console.log("connected lol")
}).catch((error) => {
    console.log(error)
})

app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    //res.send('<h1>Hello my crappy server!</h1>');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const usersRoute = require('./routes/users')
const roomsRoute = require('./routes/rooms')

app.use('/users', verifyToken, usersRoute)
app.use('/rooms', verifyToken, roomsRoute)


app.get('/login', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'login.html')) })
app.get('/register', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'register.html')) })

app.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
    
        //const User = mongoose.model("User", userSchema)
        console.log(username + " " + email + " " + password);
        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ message: 'Чувак з таким іменем вже існує🙄' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        //res.sendFile(path.join(__dirname, 'public', 'login.html'))  
        res.redirect('/login')
        //res.json({ message: 'Чувака, себто - вас, успішно зареєстровано.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Сталасі помилка' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        console.log(username + " " + password);
        const user = await User.findOne({ username });
        
        if (user) {
            if (user.password === password) {
                const token = jwt.sign({ userId: user._id }, 'mcrdnd', { expiresIn: '1h' });
                res.cookie('jwtToken', token, { httpOnly: true, maxAge: 3600000 }); 

                console.log(token)
                console.log("userId: " + user._id);
                //return res.status(200).json({ token });
                return res.redirect('/rooms/my')
                //next()
            } else {
                return res.status(401).json({ message: 'Неправильний пароль🤨' });
            }
        }

        return res.status(404).json({ message: 'Ми не знаємо такого чувака🤨' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Сталасі помилка' });
    }
});



const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Node server is running on ${port}`);
});

