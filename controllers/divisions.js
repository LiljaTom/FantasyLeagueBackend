const divisionsRouter = require('express').Router()
const Division = require('../models/division')
const Team = require('../models/team')

divisionsRouter.get('/', async(req, res) => {
    const divisions = await Division.find({}).populate('team')

    res.json(divisions.map(division => division.toJSON()))
})

divisionsRouter.post('/', async(req, res) => {
    const body = req.body

    const division = new Division({
        name: body.name,
        teams: body.teams,
        games: []
    })

    const savedDivision = await division.save()

    res.json(savedDivision.toJSON())
})

divisionsRouter.get('/:id', async(req, res) => {
    const division = await Division.findById(req.params.id)
    if(division) {
        res.json(division.toJSON())
    } else {
        res.status(404).end()
    }
})

divisionsRouter.delete('/:id', async(req, res) => {
    const division = await Division.findById(req.params.id)

    /*
    division.teams.forEach(t => {
        const team = await Team.findById(t)
        delete team.division
        await team.save()
    })
    */


    await division.remove()

    res.status(204).end()
})

divisionsRouter.put('/:id', async(req, res) => {
    const division = req.body

    const updatedDivision = await Division.findByIdAndUpdate(req.params.id, division, { new: true })
    res.json(updatedDivision.toJSON())
})

module.exports = divisionsRouter