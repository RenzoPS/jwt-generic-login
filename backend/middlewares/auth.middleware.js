const jwt = require('jsonwebtoken')

// Middleware de autenticación: Verifica si el usuario está autenticado
const authMiddleware = async (req, res, next) => {
    try {
        // Obtiene el token del header de autorización
        const token = req.header('Authorization')?.replace('Bearer ', '')
        
        // Verifica si existe el token
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            })
        }

        // Verifica y decodifica el token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // Agrega el ID del usuario decodificado a la request
        req.user = { id: decoded.id }
        
        // Continúa con la siguiente función
        next()
    } catch (error) {
        // Maneja errores de token inválido o expirado
        res.status(401).json({ 
            success: false,
            message: 'Invalid or expired token' 
        })
    }
}

module.exports = authMiddleware