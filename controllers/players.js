const playersRouter = require('express').Router()
const Player = require('../models/player')

playersRouter.get('/', async(req, res) => {
    const players = await Player.find({})

    res.json(players.map(player => player.toJSON())).populate('team')
})

playersRouter.post('/', async(req, res) => {
    const body = req.body

    const player = new Player({
        name: body.name,
        number: body.number,
        position: body.position,
        team: body.teamId
    })

    const savedPlayer = await player.save()

    res.json(savedPlayer.toJSON())
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
   await Player.findByIdAndRemove(req.params.id)
   res.status(204).end()
})

playersRouter.put('/:id', async(req, res) => {
    const player = req.body

    const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, player, { new: true })
    res.json(updatedPlayer.toJSON())
})

module.exports = playersRouter