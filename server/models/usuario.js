const mongoose = require('mongoose')

let Schema = mongoose.Schema

let userSchema = new Schema({
    email: {
        type: String,
        required: [true, "El email es obligatorio"]
    },
    name: {
        type: String,
        required: [true, "El nombre es obligatoria"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'USER'
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('user', userSchema)