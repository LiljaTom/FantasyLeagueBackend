const Team = require('../../models/team')
const Player = require('../../models/player')
const Division = require('../../models/division')

const helper = require('./testHelper')

const initialTeams = [
    {
        name: 'Kasiysi'
    },
    {
        name: 'Fireblast 4000i'
    },
    {
        name: 'Lepa'
    },
    {
        name: 'Honka'
    },
    {
        name: 'Hjk'
    }
]

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