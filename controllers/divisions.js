const divisionsRouter = require('express').Router()
const Division = require('../models/division')

divisionsRouter.get('/', (req, res, next) => {
    Division.find({})
        .then(divisions => {
            res.json(divisions.map(division => division.toJSON()))
        })
        .catch(error => next(error))
})

divisionsRouter.post('/', (req, res, next) => {
    const body = req.body

    const division = new Division({
        name: body.name,
        teams: []
    })

    division.save()
        .then(savedDivision => {
            res.json(savedDivision.toJSON())
        })
        .catch(error => next(error))
})

divisionsRouter.get('/:id', (req, res, next) => {
    Division.findById(req.params.id)
        .then(division => {
            if(division) {
                res.json(division.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

divisionsRouter.delete('/:id', (req, res, next) => {
    Division.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

divisionsRouter.put('/:id', (req, res, next) => {
    const body = req.body

    const division = {
        name: body.name,
        teams: body.name
    }

    Division.findByIdAndUpdate(req.params.id, division, { new: true })
        .then(updatedDivision => {
            res.json(updatedDivision.toJSON())
        })
        .catch(error => next(error))
})

module.exports = divisionsRouter