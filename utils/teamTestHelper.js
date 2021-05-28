const Team = require('../models/team')

const initialTeams = [
    {
        name: 'Kasiysi'
    },
    {
        name: 'Lepa'
    },
    {
        name: 'Klubi'
    },
    {
        name: 'Honka kovaluu'
    },
    {
        name: 'Fireblast 4000i'
    }
]

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
    nonExistingId
}