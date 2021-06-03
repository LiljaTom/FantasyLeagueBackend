const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('../utils/testhelpers/gameTestHelper')
const Game = require('../models/game')

beforeEach(async() => {
    await Game.deleteMany({})
    const games = await helper.initialGames()
    await Game.insertMany(games)
})

describe('Get request to the game api', () => {

    test('games are returned as json', async() => {
        await api
            .get('/api/games')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all games are returned', async() => {
        const res = await api.get('/api/games')

        expect(res.body).toHaveLength(3)
    })
})

describe('Delete request to the game api', () => {

    test('removes game and behaves correctly', async() => {
        const gamesAtStart = await helper.gamesInDb()
        const toRemove = gamesAtStart[0]

        await api
            .delete(`/api/games/${toRemove.id}`)
            .expect(204)

        const games = await helper.gamesInDb()

        expect(games).not.toContain(toRemove)

        expect(games).toHaveLength(2)
    })
})

describe('Updating game', () => {

    test('updates hometeam goals', async() => {
        const gamesAtStart = await helper.gamesInDb()
        const game = gamesAtStart[0]

        const updatedGame = {...game, hometeam_goals: 9}

        await api
            .put(`/api/games/${game.id}`)
            .send(updatedGame)
            .expect(200)

        const gamesAtEnd = await helper.gamesInDb()
        const edited = gamesAtEnd.find(g => g.id === game.id)

        expect(edited.hometeam_goals).toBe(9)
    })

    test('updates awayteam goals', async() => {
        const gamesAtStart = await helper.gamesInDb()
        const game = gamesAtStart[0]

        const updatedGame = {...game, awayteam_goals: 9}

        await api
            .put(`/api/games/${game.id}`)
            .send(updatedGame)
            .expect(200)

        const gamesAtEnd = await helper.gamesInDb()
        const edited = gamesAtEnd.find(g => g.id === game.id)

        expect(edited.awayteam_goals).toBe(9)
    })

    test('updates game status', async() => {
        const gamesAtStart = await helper.gamesInDb()
        const game = gamesAtStart[0]

        const updatedGame = {...game, done: true}

        await api
            .put(`/api/games/${game.id}`)
            .send(updatedGame)
            .expect(200)

        const gamesAtEnd = await helper.gamesInDb()
        const edited = gamesAtEnd.find(g => g.id === game.id)

        expect(edited.done).toBe(true)
    })
})

describe('Viewing a certain game', () => {

    test('returns a correct game', async() => {
        const gamesAtStart = await helper.gamesInDb()
        const game = gamesAtStart[0]

        const result = await api
            .get(`/api/games/${game.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual(JSON.parse(JSON.stringify(game)))
    })

    test('fails with statuscode 404 if non existing id', async() => {
        const nonExistingId = await helper.nonExistingId()

        await api
            .get(`/api/games/${nonExistingId}`)
            .expect(404)
    } )

    test('fails with statuscode 400 if invalid id', async() => {
        await api
            .get('/api/games/invalidID')
            .expect(400)
    })
})

describe('Posting game', () => {

    test('is succesfull with valid data', async() => {
        const game = { 
            hometeam_id: await helper.teamId('test hometeam'),
            awayteam_id: await helper.teamId('test awayteam')
        }

        await api
            .post('/api/games')
            .send(game)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const gamesAtEnd = await helper.gamesInDb()
        const gameHomeTeams = gamesAtEnd.map(g => g.hometeam_id)

        expect(gameHomeTeams).toContain(gamesAtEnd[3].hometeam_id)

        expect(gamesAtEnd).toHaveLength(4)
    })

    test('fails with statuscode 400 if missing hometeam_id', async() => {
        const invalidGame = { awayteam_id: await helper.teamId('awayteam')}

        await api
            .post('/api/games')
            .send(invalidGame)
            .expect(400)

        const gamesAtEnd = await helper.gamesInDb()

        expect(gamesAtEnd).toHaveLength(3)
    })

    test('fails with statuscode 400 if missing awayteam_id', async() => {
        const invalidGame = { hometeam_id: await helper.teamId('hometeam')}

        await api
            .post('/api/games')
            .send(invalidGame)
            .expect(400)

        const gamesAtEnd = await helper.gamesInDb()

        expect(gamesAtEnd).toHaveLength(3)
    })
})

afterAll(() => {
    mongoose.connection.close()
})