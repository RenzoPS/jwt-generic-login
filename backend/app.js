// Importar dependencias
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const errorHandler = require('./src/middlewares/errorHandler')
require('dotenv').config()

// Import rutas
const userRoutes = require('./src/routes/user.routes')

// Crear la aplicación
const app = express()

// Conectar a la base de datos
const connectDB = require('./src/config/db')
connectDB()

// Middleware
app.use(cors())  // Permite solicitudes de diferentes dominios
app.use(express.json())  // Para analizar el cuerpo de las solicitudes JSON
app.use(helmet())  // Protege la aplicación de ataques comunes
app.use(morgan('dev'))  // Registra las solicitudes HTTP en la consola
app.use(cookieParser())  // Analiza las cookies de las solicitudes

// Api
app.use('/api/users', userRoutes)

// Middleware de manejo de errores
app.use(errorHandler)  // Maneja los errores de la aplicación


module.exports = app