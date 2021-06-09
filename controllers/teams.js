const teamsRouter = require('express').Router()
const Team = require('../models/team')


teamsRouter.get('/', async(req, res) => {
    const teams = await Team.find({})
    
    res.json(teams.map(team => team.toJSON()))
})

teamsRouter.post('/', async(req, res) => {
    const body = req.body

    const team = new Team({
        name: body.name,
        players: [],
        games: []
    })

    const savedTeam = await team.save()

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
    const team = await Team.findById(req.params.id)

    await team.remove()

    res.status(204).end()
})

teamsRouter.put('/:id', async(req, res) => {
    const team = req.body

    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, team, { new: true })
    res.json(updatedTeam.toJSON())
})


module.exports = teamsRouter