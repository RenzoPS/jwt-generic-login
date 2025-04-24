const router = require('express').Router()
const userCtrl = require('../controllers/user.controller')
const auth = require('../middlewares/auth.middleware')

// Rutas públicas
router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)

// Rutas protegidas
router.use(auth)  // Middleware de autenticación para todas las rutas siguientes
router.get('/', userCtrl.getUsers)
router.put('/:id', userCtrl.updateUser)
router.delete('/:id', userCtrl.deleteUser)

module.exports = router
