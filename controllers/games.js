const gamesRouter = require('express').Router()
const Game = require('../models/game')

gamesRouter.get('/', (req, res, next) => {
    Game.find({})
        .then(games => {
            res.json(games.map(game => game.toJSON()))
        })
        .catch(error => next(error))
})

gamesRouter.post('/', (req, res, next) => {
    const body = req.body

    const game = new Game({
        hometeam_id: body.hometeam_id,
        awayteam_id: body.awayteam_id,
        hometeam_goals: 0,
        awayteam_goals: 0,
        done: false
    })

    game.save()
        .then(savedGame => {
            res.json(savedGame.toJSON())
        })
        .catch(error => next(error))
})

gamesRouter.get('/:id', (req, res, next) => {
    Game.findById(req.params.id)
        .then(game => {
            if(game) {
                res.json(game.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

gamesRouter.delete('/:id', (req, res, next) => {
    Game.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

gamesRouter.put('/:id', (req, res, next) => {
    const body = req.body

    const game = {
        hometeam_id: body.hometeam_id,
        awayteam_id: body.awayteam_id,
        hometeam_goals: body.hometeam_goals,
        awayteam_goals: body.awayteam_goals,
        done: true
    }

    Game.findByIdAndUpdate(req.params.id, game, { new: true })
        .then(updatedGame => {
            res.json(updatedGame.toJSON())
        })
        .catch(error => next(error))
})

module.exports = gamesRouter