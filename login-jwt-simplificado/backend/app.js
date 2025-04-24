// Importaciones de dependencias
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const connectDB = require('./config/db')
const errorHandler = require('./middlewares/errorHandler.middleware')
require('dotenv').config()

// Importación de rutas
const userRoutes = require('./routes/user.routes')

// Crear la aplicación Express
const app = express()

// Conectar a la base de datos
connectDB()

// Middlewares globales
app.use(cors())  // Permite peticiones de diferentes orígenes
app.use(morgan('dev'))  // Logging de peticiones HTTP
app.use(helmet())  // Seguridad de headers HTTP
app.use(express.json())  // Parseo de JSON en las peticiones

// Rutas de la API
app.use('/api/users', userRoutes)  // Rutas de usuario

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler)

module.exports = app