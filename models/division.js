const mongoose = require('mongoose')

const divisionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    teams: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        }
    ],
    games: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Game'
        }
    ]
})

divisionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Division', divisionSchema)