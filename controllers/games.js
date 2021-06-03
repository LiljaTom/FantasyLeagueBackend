const gamesRouter = require('express').Router()
const Game = require('../models/game')

gamesRouter.get('/', async(req, res) => {
    const games = await Game.find({})

    res.json(games.map(game => game.toJSON())).populate('teams')
})

gamesRouter.post('/', async(req, res) => {
   const body = req.body

   const game = new Game({
       hometeam_id: body.hometeam_id,
       awayteam_id: body.awayteam_id,
       hometeam_goals: 0,
       awayteam_goals: 0,
       done: false
   })

   const savedGame = await game.save()

   res.json(savedGame.toJSON())
})

gamesRouter.get('/:id', async(req, res) => {
    const game = await Game.findById(req.params.id)
    if(game) {
        res.json(game.toJSON())
    } else {
        res.status(404).end()
    }
})

gamesRouter.delete('/:id', async(req, res) => {
    await Game.findByIdAndRemove(req.params.id)
    res.status(204).end()
})

gamesRouter.put('/:id', async(req, res) => {
    const game = req.body

    const updatedGame = await Game.findByIdAndUpdate(req.params.id, game, { new: true })
    res.json(updatedGame.toJSON())
})

module.exports = gamesRouter