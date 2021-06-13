const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    position: {
        type: String,
        required: true,
        enum: ['St', 'Mid', 'Def', 'Gk']
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    }

})

playerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


module.exports = mongoose.model('Player', playerSchema)