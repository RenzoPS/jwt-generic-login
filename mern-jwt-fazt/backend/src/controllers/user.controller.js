const User = require('../models/user')
const bcrypt = require('bcrypt')
import { createAccessToken } from '../utils/jwt.js'

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
        res.cookie('token', token, { httpOnly: true }) // Guardar el token en una cookie
        res.status(201).json({ message: 'Usuario creado correctamente' })
    
    } catch (e) {
        res.status(500).json({ error: e.message })
    }
}