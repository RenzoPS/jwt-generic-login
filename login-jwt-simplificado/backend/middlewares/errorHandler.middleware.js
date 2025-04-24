// Middleware de manejo de errores: Centraliza el manejo de errores de la aplicación
const errorHandler = (err, req, res, next) => {
    // Loguea el error completo en la consola
    console.error(err.stack); 
    
    // Obtiene el código de estado del error o usa 500 por defecto
    const statusCode = err.statusCode || 500  
    
    // Obtiene el mensaje de error o usa un mensaje genérico
    const message = err.message || 'Internal Server Error'
    
    // En desarrollo, incluye el stack trace del error
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Envía la respuesta de error
    res.status(statusCode).json({
        success: false,
        message,
        error: isDevelopment ? err : undefined
    });
}

module.exports = errorHandler