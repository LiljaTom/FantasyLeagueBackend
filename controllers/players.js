const playersRouter = require('express').Router()
const Player = require('../models/player')


playersRouter.get('/', (req, res, next) => {
    Player.find({})
        .then(players => {
            res.json(players.map(player => player.toJSON()))
        })
        .catch(error => next(error))
})

playersRouter.post('/', (req, res, next) => {
    const body = req.body

    const player = new Player({
        name: body.name,
        number: body.number,
        position: body.position,
        team: body.teamId
    })

    player.save()
        .then(savedPlayer => {
            res.json(savedPlayer.toJSON())
        })
        .catch(error => next(error))

})

playersRouter.get('/:id', (req, res, next) => {
    Player.findById(req.params.id)
        .then(player => {
            if(player) {
                res,json(player.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

playersRouter.delete('/:id', (req, res, next) => {
    Player.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

playersRouter.put('/:id', (req, res, next) => {
    const body = req.body

    const player = {
        name: body.name,
        number: body.number,
        position: body.position
    }

    Player.findByIdAndUpdate(req.params.id, player, { new: true })
        .then(updatedPlayer => {
            res.json(updatedPlayer.toJSON())
        })
        .catch(error => next(error))
})



module.exports = playersRouter