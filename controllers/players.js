const playersRouter = require('express').Router()
const Player = require('../models/player')
const Team = require('../models/team')

playersRouter.get('/', async(req, res) => {
    const players = await Player.find({})

    res.json(players.map(player => player.toJSON())).populate('team')
})

playersRouter.get('/:id', async(req, res) => {
    const player = await Player.findById(req.params.id)
    if(player) {
        res.json(player.toJSON())
    } else {
        res.status(404).end()
    }
})

playersRouter.delete('/:id', async(req, res) => {
    const player = await Player.findById(req.params.id)
    const team = await Team.findById(player.team)

    team.players = team.players.filter(p => p.id.toString() !== req.params.id.toString())

    await team.save()
    await player.remove()

    res.status(204).end()
})

playersRouter.put('/:id', async(req, res) => {
    const player = req.body

    const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, player, { new: true })
    res.json(updatedPlayer.toJSON())
})

module.exports = playersRouter