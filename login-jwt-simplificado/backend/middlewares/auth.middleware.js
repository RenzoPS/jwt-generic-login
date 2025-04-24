const jwt = require('jsonwebtoken')
const { getSecret } = require('../config/jwt.config')
const User = require('../models/user')

// Middleware de autenticación: Verifica si el usuario está autenticado
const auth = async (req, res, next) => {
    try {
        // Obtiene el token del header de autorización
        const token = req.headers.authorization?.split(' ')[1]

        // Verifica si existe el token
        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' })
        }

        // Verifica y decodifica el token JWT
        const decoded = jwt.verify(token, getSecret())
        
        // Verifica si el usuario existe en la base de datos
        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' })
        }
        
        // Agrega el usuario decodificado a la request
        req.user = user
        
        // Continúa con la siguiente función
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' })
        }
        res.status(401).json({ message: 'Token inválido' })
    }
}

module.exports = auth