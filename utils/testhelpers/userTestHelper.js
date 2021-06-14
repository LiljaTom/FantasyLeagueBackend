const User = require('../../models/user')
const bcrypt = require('bcrypt')

const helper = require('../testhelpers/testHelper')

const initUsers = async() => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({
        username: 'root',
        name: 'admin',
        passwordHash
    })
    await user.save()
}

module.exports = {
    initUsers
}