const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('../utils/testHelper')

const Player = require('../models/player')


describe('when there is initially some players saved', () => {

    beforeEach(async () => {
        await Player.deleteMany({})
        await Player.insertMany(helper.initialPlayers)
    })

    test('players are returned as json', async() => {
        await api
            .get('/api/players')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })


})




afterAll(() => {
    mongoose.connection.close()
})