const Team = require('../../models/team')
const Player = require('../../models/player')
const Division = require('../../models/division')

const helper = require('./testHelper')

const initialTeams = async() => {

    const division = await helper.divisionId('Ykkönen')

    return[
        {
            name: 'Kasiysi',
            players:[
                await helper.playerId("Hyökkääjä", 11, "St"),
                await helper.playerId("Midfield", 4, "Mid")
            ],
            division: division
        },
        {
            name: 'Fireblast 400i',
            players:[
                await helper.playerId("Striker", 10, "St"),
                await helper.playerId("Defender", 2, "Def")
            ],
            division: division
        },
        {
            name: 'Klubi',
            players:[
                await helper.playerId("Tester", 29, "St"),
                await helper.playerId("Goalkeeper", 1, "Gk")
            ],
            division: division
        }
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