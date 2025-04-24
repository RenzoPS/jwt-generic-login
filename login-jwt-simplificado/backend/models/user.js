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

// Hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

// Verificar contraseña
userSchema.methods.checkPassword = async function(password) {
    return bcrypt.compare(password, this.password)
}

// Crea el modelo User basado en el esquema
const User = mongoose.model('User', userSchema)

module.exports = User