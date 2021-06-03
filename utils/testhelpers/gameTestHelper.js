const Game = require('../../models/game')
const Team = require('../../models/team')



const initialGames = async() => {

    await Team.deleteMany({})

    const games = [
        {
            hometeam_id: await teamId('first home'),
            awayteam_id: await teamId('first away'),
            hometeam_goals: 2,
            awayteam_goals: 0,
            done: true
        },
        {
            hometeam_id: await teamId('second home'),
            awayteam_id: await teamId('second away'),
            hometeam_goals: 0,
            awayteam_goals: 4,
            done: true  
        },
        {
            hometeam_id: await teamId('third home'),
            awayteam_id: await teamId('third away'),
            hometeam_goals: 0,
            awayteam_goals: 0,
            done: false
        }
    ]

    return games
}


const gamesInDb = async() => {
    const games = await Game.find({})

    return games.map(game => game.toJSON())
}

const nonExistingId = async() => {
    const game = new Game({
        hometeam_id: await teamId('toRemove'),
        awayteam_id: await teamId('awayRemove'),
        hometeam_goals: 0,
        awayteam_goals: 0,
        done: false
    })

    await game.save()
    await game.remove()

    return game._id.toString()
}



const teamId = async(name) => {
    const team = new Team({ name: name })

    await team.save()

    return team._id.toString()
}

module.exports = {
    initialGames,
    gamesInDb,
    teamId,
    nonExistingId
}