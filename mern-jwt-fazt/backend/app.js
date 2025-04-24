// Importar dependencias
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
require('dotenv').config()

// Import rutas
const userRoutes = require('./src/routes/user.routes')

// Crear la aplicación
const app = express()

// Conectar a la base de datos
const connectDB = require('./src/config/db')
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(morgan('dev'))

// Api
app.use('/api/users', userRoutes)

module.exports = app