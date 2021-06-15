const teamsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Team = require('../models/team')
const User = require('../models/user')


teamsRouter.get('/', async(req, res) => {
    const teams = await Team.find({})
    
    res.json(teams.map(team => team.toJSON()))
})

teamsRouter.post('/', async(req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const body = req.body

    if(!decodedToken.id || !req.token) {
        return res.status(401).json({ error: 'token missing or invalid'})
    }

    const user = await User.findById(decodedToken.id)

    const team = new Team({
        name: body.name,
        players: [],
        games: [],
        users: [user]
    })

    const savedTeam = await team.save()

    user.teams = user.teams.concat(savedTeam._id)
    await user.save()

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
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    const team = await Team.findById(req.params.id)

    if(!team.users.map(t => t.toString()).includes(user.id.toString())) {
        return res.status(401).json({ error: 'only admin can remove the team'})
    }

    user.teams = user.teams.filter(t => t.id.toString() !== req.params.id.toString())

    await user.save()
    await team.remove()

    res.status(204).end()
})

teamsRouter.put('/:id', async(req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const team = req.body

    const teamToUpgrade = await Team.findById(req.params.id)
    const user = await User.findById(decodedToken.id)

    if(!teamToUpgrade.users.map(t => t.toString()).includes(user.id.toString())) {
        return res.status(401).json({ error: 'only admin can edit the team'})
    }

    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, team, { new: true })
    res.json(updatedTeam.toJSON())
})


module.exports = teamsRouter