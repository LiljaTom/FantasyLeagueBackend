const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const teamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    ],
    division: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Division'
    }
})

teamSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

teamSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Team', teamSchema)