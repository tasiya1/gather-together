const express = require('express')
const path = require('path');
const router = express.Router()

router.get('/', (req, res) => {
    //res.send('this is filter route')
    res.sendFile(path.join(__dirname, '..', 'public', 'myRooms.html'));
})

router.get('/testroom', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'selectTime.html'));
})

router.get('/createroom', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'createRoom.html'));
})

router.get('/joinroom', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'joinRoom.html'));
})

module.exports = router;