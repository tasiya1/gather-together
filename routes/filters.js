const express = require('express')
const path = require('path');
const router = express.Router()

router.get('/', (req, res) => {
    //res.send('this is filter route')
    res.sendFile(path.join(__dirname, 'public', 'filters.html'));
})

router.get('/101', (req, res) => {
    res.send('this is filter 101 route')
})

module.exports = router;