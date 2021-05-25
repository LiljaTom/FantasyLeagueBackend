const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: Number,
        required: true
    },
    position: {
        type: String,
        required: true,
        enum: ['St', 'Mid', 'Def', 'Gk']
    }

})

playerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

playerSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Player', playerSchema)