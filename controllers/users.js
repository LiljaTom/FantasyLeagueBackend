const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

usersRouter.post('/', async(req, res) => {
    const body = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
        teams: [],
        divisions: []
    })

    const savedUser = await user.save()

    res.json(savedUser)
})

usersRouter.put('/:id', async(req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const body = req.body

    const user = await User.findById(decodedToken.id)

    if(user.id.toString() !== req.params.id.toString()) {
        return res.status(401).json({ error: 'user can only edit itself'})
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, body, { new: true })
    res.json(updatedUser)
})

usersRouter.get('/:id', async(req, res) => {
    const user = await User.findById(req.params.id)
    if(user) {
        res.json(user.toJSON())
    } else {
        res.status(404).end()
    }
})

usersRouter.delete('/:id', async(req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    const userToRemove = await User.findById(req.params.id)
    const user = await User.findById(decodedToken.id)

    if(userToRemove.id.toString() !== user.id.toString()) {
        return res.status(401).json({ error: 'user can only delete itself'})
    }

    await userToRemove.remove()

    res.status(204).end()
})

module.exports = usersRouter