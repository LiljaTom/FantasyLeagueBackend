const Team = require('../models/team')
const Player = require('../models/player')

const initialTeams = [
    {
        name: 'Kasiysi',
        players: []
    },
    {
        name: 'Lepa',
        players: []
    },
    {
        name: 'Klubi',
        players: []
    },
    {
        name: 'Honka kovaluu',
        players: []
    },
    {
        name: 'Fireblast 4000i',
        players: []
    }
]

const initialTeamsWithPlayers = async() => {
    await Player.deleteMany({})
    const playerIds = await playerIDs()
    const players = initialTeams

    players[0].players = playerIds

    return players
}

const playerIDs = async() => {
    const player1 = new Player({ name: 'Test player', number: 32, position: 'St'})
    const player2 = new Player({ name: 'Test defender', number: 3, position: 'Def'})

    await player1.save()
    await player2.save()

    const ids = [player1._id.toString(), player2._id.toString()]

    return ids
}


const nonExistingId = async() => {
    const team = new Team({ name: 'toRemove' })
    await team.save()
    await team.remove()

    return team._id.toString()
}

const teamsInDb = async() => {
    const teams = await Team.find({})

    return teams.map(team => team.toJSON())
}

module.exports = {
    initialTeams,
    teamsInDb,
    nonExistingId,
    initialTeamsWithPlayers
}