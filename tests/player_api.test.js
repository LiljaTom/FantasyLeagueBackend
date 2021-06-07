const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('../utils/testHelpers/testHelper')
const playerHelper = require('../utils/testhelpers/playerTestHelper')

const Player = require('../models/player')

beforeEach(async () => {
    await helper.clearDb()
    await Player.insertMany(await playerHelper.initialPlayers())
})

describe('Get request to the api', () => {

    test('players are returned as json', async() => {
        await api
            .get('/api/players')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all players are returned', async() => {
        const res = await api.get('/api/players')

        expect(res.body).toHaveLength(4)
    })

    test('returns a certain player', async() => {
        const res = await api.get('/api/players')
        
        const players = res.body.map(player => player.name)

        expect(players).toContain('Test striker')
    })
})

describe('Delete request to api', () => {

    test('removes player and behaves correctly', async() => {
        const playersAtStart = await helper.playersInDb()
        const toRemove = playersAtStart[0]

        await api
            .delete(`/api/players/${toRemove.id}`)
            .expect(204)

        const players = await helper.playersInDb()

        expect(players).not.toContain(toRemove)

        expect(players).toHaveLength(playersAtStart.length - 1)
    })

})

describe('Updating player', () => {

    test('updates player name', async() => {
        const playersAtStart = await helper.playersInDb()
        const player = playersAtStart[0]

        const updatedPlayer = {...player, name: 'Updated player'}

        await api
            .put(`/api/players/${player.id}`)
            .send(updatedPlayer)
            .expect(200)

        const playersAtEnd = await helper.playersInDb()
        const edited = playersAtEnd.find(p => p.id === player.id)
        
 
        expect(edited.name).toBe('Updated player')
    })

    test('updates players number', async() => {
        const playersAtStart = await helper.playersInDb()
        const player = playersAtStart[0]

        const updatedPlayer = {...player, number: 55}

        await api
            .put(`/api/players/${player.id}`)
            .send(updatedPlayer)
            .expect(200)

        const playersAtEnd = await helper.playersInDb()
        const edited = playersAtEnd.find(p => p.id === player.id)
        
 
        expect(edited.number).toBe(55)
    })

    test('updates players position', async() => {
        const playersAtStart = await helper.playersInDb()
        const player = playersAtStart[0]

        const updatedPlayer = {...player, position: 'Gk'}

        await api
            .put(`/api/players/${player.id}`)
            .send(updatedPlayer)
            .expect(200)

        const playersAtEnd = await helper.playersInDb()
        const edited = playersAtEnd.find(p => p.id === player.id)
        
 
        expect(edited.position).toBe('Gk')
    })

})

describe('Viewing a certain player', () => {

    test('return a correct player', async() => {
        const playersAtStart = await helper.playersInDb()
        const player = playersAtStart[0]

        const result = await api
            .get(`/api/players/${player.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        
        expect(result.body).toEqual(JSON.parse(JSON.stringify(player)))
    })

    test('fails with statuscode 404 if non existing id', async() => {
        const nonExistingId = await playerHelper.nonExistingPlayerId()

        await api
            .get(`/api/players/${nonExistingId}`)
            .expect(404)
    })

    test('fails with statuscode 400 if invalid id', async() => {
        const invalidId = 'soInvalid'

        await api
            .get(`/api/players/${invalidId}`)
            .expect(400)
    })
})

describe('Posting player', () => {

    test('is succesfull with valid data', async() => {

        const player = {
            name: 'new player',
            number: 50,
            position: 'Def'
        }

        await api
            .post('/api/players')
            .send(player)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const playersAtEnd = await helper.playersInDb()
        const players = playersAtEnd.map(player => player.name)

        expect(players).toContain('new player')

        expect(playersAtEnd).toHaveLength(5)
    })

    test('fails with status code 400 if missing name', async() => {

        const invalidPlayer = {
            number: 12,
            position: 'St'
        }

        await api
            .post('/api/players')
            .send(invalidPlayer)
            .expect(400)

        const playersAtEnd = await helper.playersInDb()
        expect(playersAtEnd).toHaveLength(4)

    })

    test('fails with status code 400 if missing number', async() => {

        const invalidPlayer = {
            name: 'Invalid player',
            position: 'St'
        }

        await api
            .post('/api/players')
            .send(invalidPlayer)
            .expect(400)

        const playersAtEnd = await helper.playersInDb()
        expect(playersAtEnd).toHaveLength(4)

    })

    test('fails with status code 400 if missing position', async() => {

        const invalidPlayer = {
            name: 'Invalid player',
            number: 12
        }

        await api
            .post('/api/players')
            .send(invalidPlayer)
            .expect(400)

        const playersAtEnd = await helper.playersInDb()
        expect(playersAtEnd).toHaveLength(4)

    })

    test('fails with status code 400 if invalid position', async() => {

        const invalidPlayer = {
            name: 'Invalid position',
            number: 12,
            position: 'Inv'
        }

        await api
            .post('/api/players')
            .send(invalidPlayer)
            .expect(400)

        const playersAtEnd = await helper.playersInDb()
        expect(playersAtEnd).toHaveLength(4)

    })
    

})

afterAll(() => {
    mongoose.connection.close()
})