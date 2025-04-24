const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { getSecret } = require('../config/jwt.config')

// Crear token JWT
const createToken = (userId) => jwt.sign({ id: userId }, getSecret(), { expiresIn: '24h' })

// Formatear respuesta de usuario
const formatUserResponse = (user, token) => ({
    token,
    user: {
        id: user._id,
        username: user.username,
        email: user.email
    }
})

// Registro
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' })
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            return res.status(400).json({ message: 'Usuario o email ya existe' })
        }

        const user = await User.create({ username, email, password })
        res.status(201).json(formatUserResponse(user, createToken(user._id)))
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' })
    }
}

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user || !(await user.checkPassword(password))) {
            return res.status(401).json({ message: 'Credenciales inválidas' })
        }

        res.json(formatUserResponse(user, createToken(user._id)))
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' })
    }
}

// Obtener usuarios
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username email')
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' })
    }
}

// Actualizar usuario
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, select: 'username email' }
        )
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' })
    }
}

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }
        
        res.json({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' })
    }
}

