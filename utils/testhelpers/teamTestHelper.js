const Team = require('../../models/team')
const Player = require('../../models/player')
const Division = require('../../models/division')

const helper = require('./testHelper')

const initialTeams = async() => {
    const users = await helper.usersInDb()
    await Player.deleteMany({})
    const player1 = new Player({ name: 'Test player1', number: 56, position: "St"})
    const player2 = new Player({ name: 'Test player2', number: 52, position: "Mid"})
    const player3 = new Player({ name: 'Test player3', number: 53, position: "Def"})
    await player1.save()
    await player2.save()
    await player3.save()

    const team1 = {
        name: 'Kasiysi',
        users: [users[0].id],
        players: [player1._id.toString(), player2._id.toString()]
    }

    const team2 = {
        name: 'Fireblast 4000i',
        users: [users[1].id],
        players: [player3._id.toString()]
    }

    const team3 = {
        name: 'Lepa',
        users: [users[0].id, users[1].id],
        players: []
    }

    return[
        team1, team2, team3
    ]
}


const nonExistingTeamId = async() => {
    const team = new Team({ name: 'toRemove' })
    await team.save()
    await team.remove()

    return team._id.toString()
}


module.exports = {
    initialTeams,
    nonExistingTeamId,
}