const jwt = require('jsonwebtoken')
const path = require('path')

function verifyToken(req, res, next) {
    //const token = req.header('Authorization')
    const token = req.cookies.jwtToken;
    console.log(token)
    if (!token) {        
        console.log("Access denied: No token provided")
        return res.redirect('/login')
    } else {
        jwt.verify(token, 'mcrdnd', (error, decoded) => {
            if (error) {
                console.error("Token verification failed:", error)
                //res.status(401).json({ error: 'Invalid token' })
                return res.redirect('/login')
            } else {
                req.userId = decoded.userId
                console.log("userId (Middleware): " + req.userId)
                next()
            }
        })
    }
}

module.exports = verifyToken