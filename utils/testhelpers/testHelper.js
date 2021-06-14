const Team = require('../../models/team')
const Player = require('../../models/player')
const Division = require('../../models/division')
const Game = require('../../models/game')
const User = require('../../models/user')



const teamsInDb = async() => {
    const teams = await Team.find({})

    return teams.map(team => team.toJSON())
}

const gamesInDb = async() => {
    const games = await Game.find({})

    return games.map(game => game.toJSON())
}

const divisionsInDb = async() => {
    const divisions = await Division.find({})

    return divisions.map(div => div.toJSON())
}

const playersInDb = async() => {
    const players = await Player.find({})

    return players.map(player => player.toJSON())
}

const playerId = async(name, number, position) => {
    const player = new Player({ name: name, number: number, position: position})

    await player.save()

    return player._id.toString()
}

const teamId = async(name) => {
    const team = new Team({ name: name })

    await team.save()

    return team._id.toString()
}

const divisionId = async(name) => {
    const division = new Division({ name: name})

    await division.save()

    return division._id.toString()
}

const usersInDb = async() => {
    const users = await User.find({})

    return users.map(u => u.toJSON())
}

const clearDb = async() => {
    await Team.deleteMany({})
    await Player.deleteMany({})
    await Game.deleteMany({})
    await Division.deleteMany({})
}

module.exports = {
    teamsInDb,
    gamesInDb,
    divisionsInDb,
    playersInDb,
    playerId,
    teamId,
    divisionId,
    clearDb,
    usersInDb
}