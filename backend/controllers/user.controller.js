const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { getSecret } = require('../config/jwt.config')

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, getSecret(), {
        expiresIn: '24h'
    })
}

// Registro de nuevo usuario
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        // Validación: Verifica que todos los campos requeridos estén presentes
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // Verifica si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' })
        }

        // Crea un nuevo usuario (el hash de la contraseña se hace en el modelo)
        const newUser = new User({ username, email, password })
        await newUser.save()

        // Genera un token JWT para el nuevo usuario
        const token = generateToken(newUser._id)
        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        })

    } catch (e) {
        console.error('Registration error:', e)
        res.status(500).json({error: e.message})
    }
}

// Login de usuario
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Busca el usuario por email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Verifica la contraseña usando bcrypt directamente
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Genera un token JWT para el usuario autenticado
        const token = generateToken(user._id)
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (e) {
        console.error('Login error:', e)
        res.status(500).json({error: e.message})
    }
}

// Logout de usuario
exports.logout = async (req, res) => {
    try{
        // Limpia la cookie del token
        res.clearCookie('token')
        res.status(200).json({ message: 'Logout successful' })
    } catch (e) {
        res.status(500).json({error: e.message})
    }
}

// Obtener lista de usuarios (nombres y emails)
exports.getUsers = async (req, res) => {
    try {
        // Obtiene username y email de los usuarios
        const users = await User.find({}, 'username email');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

// Actualizar datos de usuario
exports.updateUser = async (req, res) => {
    try{
        // Busca y actualiza el usuario por ID
        const updated = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        )
        if (!updated) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(updated)
    } catch (e) {
        res.status(500).json({error: e.message})
    }
}

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try{
        // Busca y elimina el usuario por ID
        const deleted = await User.findByIdAndDelete(req.params.id)
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ message: 'User deleted successfully' })
    } catch (e) {
        res.status(500).json({error: e.message})
    }
}

