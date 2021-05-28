const teamsRouter = require('express').Router()
const team = require('../models/team')
const Team = require('../models/team')

teamsRouter.get('/', (req, res, next) => {
    Team.find({})
        .then(teams => {
            res.json(teams.map(team => team.toJSON()))
        })
        .catch(error => next(error))
})

teamsRouter.post('/', (req, res, next) => {
    const body = req.body

    const team = new Team({
        name: body.name,
        players: []
    })

    team.save()
        .then(savedTeam => {
            res.json(savedTeam.toJSON())
        })
        .catch(error => next(error))
})

teamsRouter.get('/:id', (req, res, next) => {
    Team.findById(req.params.id)
        .then(team => {
            if(team) {
                res.json(team.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

teamsRouter.delete('/:id', (req, res, next) => {
    Team.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

teamsRouter.put('/:id', (req, res, next) => {
    const body = req.body

    const team = {
        name: body.name,
        players: body.name
    }

    Team.findByIdAndUpdate(req.params.id, team, { new: true })
        .then(updatedTeam => {
            res.json(updatedTeam.toJSON())
        })
        .catch(error => next(error))
})


module.exports = teamsRouter