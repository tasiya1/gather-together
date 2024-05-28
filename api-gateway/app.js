const express = require('express')
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => { next() })

app.use('/auth', createProxyMiddleware({target: 'http://localhost:3000', changeOrigin: true, pathRewrite: {'^/auth': ''}}))

app.use('/rooms', createProxyMiddleware({target: 'http://localhost:3001', changeOrigin: true, pathRewrite: {'^/rooms': ''}}))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(port, () => {
    console.log(`batya server listening at http://localhost:${port}`)
})

module.exports = app;
