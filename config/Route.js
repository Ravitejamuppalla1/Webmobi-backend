const express  = require('express')
const route  = express.Router()
const userCtlr = require('../App/controllers/users_controller')
const authenticate = require('../App/middlewares/authenticate')

route.post('/register',userCtlr.registerUser)
route.post('/login',userCtlr.loginUser)
route.get('/profile',authenticate,userCtlr.getProfile)


module.exports = route