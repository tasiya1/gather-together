
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

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    //res.send('<h1>Hello my crappy server!</h1>');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const usersRoute = require('./routes/users')
const filtersRoute = require('./routes/filters')

app.use('/users', usersRoute)
app.use('/filters', filtersRoute)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Node server is running on ${port}`);
});

