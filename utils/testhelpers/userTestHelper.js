const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const helper = require('../testhelpers/testHelper')

const initUsers = async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const admin = new User({
        username: 'root',
        name: 'admin',
        passwordHash
    })

    const user = new User({
        username: 'username',
        name: 'name',
        passwordHash
    }) 

    await admin.save()
    await user.save()
}

const loginAndReturnToken = async(username) => {
    const user = await User.findOne({ username: username })
    const userForToken = {
        id: user._id,
        username: user.username
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    return token
}

const nonExistingUserId = async() => {
    const user = new User({ username: 'toRemove', name: 'toRemove', passwordHash: 'password' })
    await user.save()
    await user.remove()

    return user._id.toString()
}

module.exports = {
    initUsers,
    loginAndReturnToken,
    nonExistingUserId
}