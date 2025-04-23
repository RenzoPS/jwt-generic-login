const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Esquema de Usuario: Define la estructura de datos para los usuarios en la base de datos
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,    // El nombre de usuario es obligatorio
        unique: true      // No puede haber dos usuarios con el mismo nombre
    },
    email: {
        type: String,
        required: true,    // El email es obligatorio
        unique: true      // No puede haber dos usuarios con el mismo email
    },
    password: {
        type: String,
        required: true    // La contraseña es obligatoria
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true      // Agrega automáticamente createdAt y updatedAt
})

// Middleware pre-save: Se ejecuta antes de guardar un usuario
userSchema.pre('save', async function (next) {
    // Solo encripta la contraseña si ha sido modificada
    if (!this.isModified('password')) {
        next()
    }
    try{    
        // Genera un salt (valor aleatorio) para la encriptación
        const salt = await bcrypt.genSalt(10)
        // Encripta la contraseña usando el salt
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

// Método para comparar contraseñas: Usado en el login
userSchema.methods.comparePassword = async function (candidatePassword) {
    // Compara la contraseña proporcionada con la encriptada
    return await bcrypt.compare(candidatePassword, this.password)
}

// Crea el modelo User basado en el esquema
const User = mongoose.model('User', userSchema)

module.exports = User