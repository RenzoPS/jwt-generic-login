const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: { type: String, require: true, trim: true },  // Trim: elimina los espacios en blanco al principio y al final
    email: { type: String, require: true, unique: true, trim: true},  
    password: { type: String, require: true, trim: true },
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
module.exports = User