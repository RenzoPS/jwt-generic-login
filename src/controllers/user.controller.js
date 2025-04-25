const User = require('../models/user.js')
const bcrypt = require('bcryptjs')
const { createAccessToken } = require('../utils/jwt.js')

exports.register = async (req, res) => {
    const { userName, email, password } = req.body
    try{

        // Hash the password
        const passwordHashed = await bcrypt.hash(password, 10)
        
        // Validar que los datos no estén vacíos
        if(!userName || !email || !password){
            return res.status(400).json({ message: 'Todos los datos son requeridos' })
        }
        
        // Verifica que el usuario no exista con el mail
        const userExists = await User.findOne({ email })
        if(userExists){
            return res.status(400).json({ message:'User already exists' })
        }

        // Crea el nuevo usuario
        const newUser = new User({ userName, email, password: passwordHashed })
        await newUser.save()

        // Crea el token con la funcion importada
        const token = await createAccessToken({ id: newUser._id })
        res.cookie('token', token, { httpOnly: true }) // Guardar el token en una cookie.
        // httpOnly: true significa que la cookie no es accesible desde JavaScript del lado del cliente, lo que ayuda a prevenir ataques XSS (Cross-Site Scripting).

        res.status(201).json({
            id: newUser._id,
            userName: newUser.userName,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        })

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body
    try{
        
        // Validar que los datos no esten vacios
        if(!email || !password){
            return res.status(400).json({ message: 'Todos los datos son requeridos' })
        }

        // Verifica que el mail exista
        const userFound = await User.findOne({ email })
        if(!userFound){
            return res.status(400).json({ message: 'User is not found' })
        }

        // Verifica que la contraseña sea correcta
        const isMatch = await bcrypt.compare(password, userFound.password)
        if(!isMatch){ // Si la contraseña no coincide
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        // Crea el token con la funcion importada
        const token = await createAccessToken({ id: userFound._id })
        res.cookie('token', token, { httpOnly: true }) // Guardar el token en una cookie
        return res.status(200).json({
            id: userFound._id,
            userName: userFound.userName,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.logout = async (req, res) => {
    try{
        res.clearCookie('token') // Limpiar la cookie
        res.status(200).json({ message: 'Logout success' })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}
 
exports.getProfile = async (req, res) => {
    try{
        const userFound = await User.findById(req.user.id) // Busca el usuario por ID

        // Si no se encuentra el usuario, devuelve un error 404
        if(!userFound){ 
            return res.status(404).json({ message: 'User not found' })
        }

        // Si se encuentra el usuario, devuelve la información del perfil
        return res.status(200).json({
            id: userFound._id,
            userName: userFound.userName,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

exports.updateUserName = async (req, res) => {
    try{
        const { userName } = req.body // Obtiene el nuevo nombre de usuario del cuerpo de la solicitud
        if(!userName){
            return res.status(400).json({ message: 'Username is required' }) // Si no se proporciona un nuevo nombre de usuario, devuelve un error 400
        }

        const userUpdated = await User.findByIdAndUpdate(
            req.user.id, // ID del usuario a actualizar
            { userName }, // Datos a actualizar (nombre de usuario)
        )

        // Si no se encuentra el usuario, devuelve un error 404
        if(!userUpdated){
            return res.status(404).json({ message: 'User not found' })
        }
        res.json(userUpdated.userName) // Devuelve el usuario actualizado

    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}