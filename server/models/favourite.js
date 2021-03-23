const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
 
let Schema = mongoose.Schema

let favSchema = new Schema({
    queryString: {
        type: String,
        required: [true, "El queryString es obligatorio"],
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
})

favSchema.methods.toJSON = function() {
    let fav = this
    let favObject = fav.toObject()

    favObject.uid = favObject._id
    delete favObject._id

    return favObject
}

favSchema.plugin(uniqueValidator, { message: 'Ya existe una búsqueda en favoritos con este {PATH}'});

module.exports = mongoose.model('Favourite', favSchema)