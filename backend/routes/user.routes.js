const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const isOwnerOrAdmin = require('../middlewares/isOwnerOrAdmin.middleware')

// Rutas públicas (no requieren autenticación)
router.post('/register', userController.register)  // Registro de nuevo usuario
router.post('/login', userController.login)        // Login de usuario
router.post('/logout', userController.logout)      // Logout de usuario

// Rutas protegidas (requieren autenticación)
router.get('/', authMiddleware, userController.getUsers)  // Obtener lista de usuarios

// Rutas que requieren ser propietario o admin
router.get('/:id', authMiddleware, isOwnerOrAdmin, userController.getUsers)    // Obtener usuario específico
router.put('/:id', authMiddleware, isOwnerOrAdmin, userController.updateUser) // Actualizar usuario
router.delete('/:id', authMiddleware, isOwnerOrAdmin, userController.deleteUser) // Eliminar usuario

module.exports = router
