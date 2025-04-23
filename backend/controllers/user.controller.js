const User = require('../models/user')
const jwt = require('jsonwebtoken')

// Registro de nuevo usuario
exports.register = async (req, res) => {
    try{
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

        // Crea un nuevo usuario con los datos proporcionados
        const newUser = new User({ username, email, password })
        await newUser.save()

        // Genera un token JWT para el nuevo usuario
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(201).json({ message: 'User registered successfully', token })

    } catch (e) {
        res.status(500).json({error: e.message})
    }
}

// Login de usuario
exports.login = async (req, res) => {
    try{
        const { email, password } = req.body

        // Busca el usuario por email
        const userLogin = await User.findOne({ email })
        if (!userLogin) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Verifica la contraseña usando el método comparePassword
        const isPasswordValid = await userLogin.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Genera un token JWT para el usuario autenticado
        const token = jwt.sign({ id: userLogin._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ message: 'Login successful', token })
    } catch (e) {
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

// Obtener lista de usuarios (solo nombres)
exports.getUsers = async (req, res) => {
    try {
        // Obtiene solo los nombres de usuario de la base de datos
        const users = await User.find({}, 'username');
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

