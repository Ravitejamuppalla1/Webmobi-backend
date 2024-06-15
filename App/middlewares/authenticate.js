const jwt = require('jsonwebtoken')
require('dotenv').config()

const userAuthenticate = (req, res, next) => {
    const authHeader = req.header('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const verifytoken = jwt.verify(token, process.env.SECRET_KEY)
        req.user = {
            id: verifytoken.id,
            username: verifytoken.username
        }
        next()
    } catch (err) {
        console.error('JWT verification error:', err.message)
        return res.status(401).json({ error: 'Access denied' })
    }
}

module.exports = userAuthenticate
