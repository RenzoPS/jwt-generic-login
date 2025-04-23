// Middleware de manejo de errores: Centraliza el manejo de errores de la aplicación
const errorHandler = (err, req, res, next) => {
    // Obtiene el código de estado del error o usa 500 por defecto
    const statusCode = err.statusCode || 500
    
    // Obtiene el mensaje de error o usa un mensaje genérico
    const message = err.message || 'Internal Server Error'
    
    // En desarrollo, incluye el stack trace del error
    const error = process.env.NODE_ENV === 'development' ? err : {}
    
    // Envía la respuesta de error
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error : undefined
    })
}

module.exports = errorHandler