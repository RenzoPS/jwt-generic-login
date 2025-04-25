const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller') // Importa el controlador de usuario
const { authRequired } = require('../middlewares/validateToken') // Importa el middleware de autenticación

// Define las rutas para el usuario
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/profile', authRequired, userController.getProfile)
router.patch('/update-username', authRequired, userController.updateUserName)

module.exports = router