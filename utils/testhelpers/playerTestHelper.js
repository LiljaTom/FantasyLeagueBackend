const Team = require('../../models/team')
const Player = require('../../models/player')

const helper = require('../testhelpers/testHelper')


const initialPlayers = async() => {

    const team1 = await helper.teamId("Test Team1")
    const team2 = await helper.teamId("Test Team2")

    return[
        {
            name: 'Test striker',
            number: 9,
            position: 'St',
            team: team1
        },
        {
            name: 'Test midfielder',
            number: 10,
            position: 'Mid',
            team: team1
        },
        {
            name: 'Test defender',
            number: 4,
            position: 'Def',
            team: team2
        },
        {
            name: 'Test goalie',
            number: 1,
            position: 'Gk',
            team: team2
        }
    ]
}


const nonExistingPlayerId = async() => {
    const player = new Player({ name: 'Test player', number: 56, position: "St"})
    await player.save()
    await player.remove()

    return player._id.toString()
}

module.exports = {
    initialPlayers,
    nonExistingPlayerId
}