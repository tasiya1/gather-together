const express = require('express')
const path = require('path');
const router = express.Router()

router.get('/', (req, res) => {
    res.send('this is user route')
})

router.get('/101', (req, res) => {
    res.send('this is user 101 route')
})

module.exports = router;