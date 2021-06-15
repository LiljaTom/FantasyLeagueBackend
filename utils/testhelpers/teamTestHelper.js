const Team = require('../../models/team')
const Player = require('../../models/player')
const Division = require('../../models/division')

const helper = require('./testHelper')

const initialTeams = async() => {
    const users = await helper.usersInDb()

    const team1 = {
        name: 'Kasiysi',
        users: [users[0].id]
    }

    const team2 = {
        name: 'Fireblast 4000i',
        users: [users[1].id]
    }

    const team3 = {
        name: 'Lepa',
        users: [users[0].id, users[1].id]
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