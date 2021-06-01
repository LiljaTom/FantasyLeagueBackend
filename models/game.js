const mongoose = require('mongoose')


const gameSchema = mongoose.Schema({
    hometeam_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    awayteam_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    hometeam_goals: {
        type: Number,
        required: true
    },
    awayteam_goals: {
        type: Number,
        required: true
    },
    done: {
        type: Boolean
    }
})

gameSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Game', gameSchema)