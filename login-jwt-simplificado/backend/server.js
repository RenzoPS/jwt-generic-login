// Cargar variables de entorno
require('dotenv').config()

// Importar la aplicación Express configurada
const app = require('./app')

// Definir el puerto del servidor (usar variable de entorno o 3000 por defecto)
const PORT = process.env.PORT || 3000

// Escucha en el puerto definido
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
