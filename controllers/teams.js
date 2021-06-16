const teamsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Team = require('../models/team')
const User = require('../models/user')
const Player = require('../models/player')


teamsRouter.get('/', async(req, res) => {
    const teams = await Team.find({})
    
    res.json(teams.map(team => team.toJSON()))
})

teamsRouter.post('/', async(req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const body = req.body

    if(!decodedToken.id || !req.token) {
        return res.status(401).json({ error: 'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)

    const team = new Team({
        name: body.name,
        players: [],
        games: [],
        users: [user]
    })

    const savedTeam = await team.save()

    user.teams = user.teams.concat(savedTeam._id)
    await user.save()

    res.json(savedTeam.toJSON())
})

teamsRouter.get('/:id', async(req, res) => {   
    const team = await Team.findById(req.params.id)
    if(team) {
        res.json(team.toJSON())
    } else {
        res.status(404).end()
    }
})

teamsRouter.delete('/:id', async(req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const team = await Team.findById(req.params.id)

    if(!team.users.map(t => t.toString()).includes(user.id.toString())) {
        return res.status(401).json({ error: 'only admin can remove the team'})
    }

    user.teams = user.teams.filter(t => t.toString() !== req.params.id.toString())

    await user.save()
    await team.remove()

    res.status(204).end()
})

teamsRouter.put('/:id', async(req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const team = req.body

    const teamToUpgrade = await Team.findById(req.params.id)
    const user = await User.findById(decodedToken.id)

    if(!teamToUpgrade.users.map(t => t.toString()).includes(user.id.toString())) {
        return res.status(401).json({ error: 'only admin can edit the team'})
    }

    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, team, { new: true })
    res.json(updatedTeam.toJSON())
})

teamsRouter.post('/:id/players', async(req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const body = req.body

    const team = await Team.findById(req.params.id)
    const user = await User.findById(decodedToken.id)

    if(!team.users.map(u => u.toString()).includes(user.id.toString())) {
        return res.status(401).json({ error: 'only admin can create player to the team'})
    }

    const player = new Player({
        name: body.name,
        number: body.number,
        position: body.position,
        team: team._id
    })

    const savedPlayer = await player.save()
    team.players = team.players.concat(savedPlayer._id)
    await team.save()

    res.json(savedPlayer.toJSON())
})

teamsRouter.get('/:teamId/players/:playerId', async(req, res) => {
    const player = await Player.findById(req.params.playerId)

    if(player) {
        res.json(player.toJSON())
    } else {
        res.status(404).end()
    }
})

teamsRouter.put('/:teamId/players/:playerId', async(req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const body = req.body

    const user = await User.findById(decodedToken.id)
    const team = await Team.findById(req.params.teamId)

    if(!team.users.map(u => u.toString()).includes(user.id.toString())) {
        return res.status(401).json({ error: 'only admin can edit team`s player'})
    }

    const updatedPlayer = await Player.findByIdAndUpdate(req.params.playerId, body, { new: true })

    res.json(updatedPlayer)
})

teamsRouter.delete('/:teamId/players/:playerId', async(req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    
    const user = await User.findById(decodedToken.id)
    const team = await Team.findById(req.params.teamId)


    if(!team.users.map(u => u.toString()).includes(user.id.toString())) {
        return res.status(401).json({ error: 'only admin can delete team`s player'})
    }

    const playerToRemove = await Player.findById(req.params.playerId)
    
    team.players = team.players.filter(p => p.toString() !== req.params.playerId.toString())

    await team.save()
    await playerToRemove.remove()

    res.status(204).end()
})





module.exports = teamsRouter