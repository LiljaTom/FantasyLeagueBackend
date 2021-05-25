const playersRouter = require('express').Router()
const Player = require('../models/player')


playersRouter.get('/', (req, res, next) => {
    Player.find({})
        .then(players => {
            res.json(players.map(player => player.toJSON()))
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

module.exports = playersRouter