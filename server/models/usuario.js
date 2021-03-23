const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
 
let Schema = mongoose.Schema

let validRoles = {
    values: ['USER', 'ADMIN'],
    message: '{VALUE} no es un rol válido'
}

let userSchema = new Schema({
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true
    },
    name: {
        type: String,
        required: [true, "El nombre es obligatoria"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    favourites: [{ 
        type: Schema.Types.ObjectId, ref: 'Favourite'
    }],
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'USER',
        enum: validRoles
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

userSchema.methods.toJSON = function() {
    let user = this
    let userObject = user.toObject()
    delete userObject.password

    userObject.uid = userObject._id
    delete userObject._id

    return userObject
}

userSchema.plugin(uniqueValidator, { message: 'Ya existe un usuario con este {PATH}'});

module.exports = mongoose.model('user', userSchema)