const Player = require('../models/player')


const initialPlayers = [
    {
        name: 'Test Striker',
        number: 9,
        position: 'St',
    },
    {
        name: 'Test Midfielder',
        number: 10,
        position: 'Mid',
    },
    {
        name: 'Test Defender',
        number: 4,
        position: 'Def',
    },
    {
        name: 'Test Goalkeeper',
        number: 1,
        position: 'Gk',
    }
]

const nonExistingId = async() => {
    const player = new Player({ name:'toremove', number: 12, position:'St'})
    await player.save()
    await player.remove()

    return player._id.toString()
}

const playersInDb = async() => {
    const players = await Player.find({})

    return players.map(player => player.toJSON())
}


module.exports = {
    initialPlayers,
    playersInDb,
    nonExistingId
}