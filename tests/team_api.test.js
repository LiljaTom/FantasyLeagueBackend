const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('../utils/teamTestHelper')

const Team = require('../models/team')


beforeEach(async() => {
    await Team.deleteMany({})
    const teams = await helper.initialTeamsWithPlayers()
    await Team.insertMany(teams)
})

describe('Get request to the team api', () => {

    test('teams are returned as json', async() => {
        await api
            .get('/api/teams')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all teams are returned', async() => {
        const res = await api.get('/api/teams')

        expect(res.body).toHaveLength(helper.initialTeams.length)
    })

    test('returns a certain team', async() => {
        const res = await api.get('/api/teams')

        const teams = res.body.map(team => team.name)

        expect(teams).toContain('Kasiysi')
    })
})

describe('Delete request to team api', () => {

    test('removes team and behaves correctly', async() => {
        const teamsAtStart = await helper.teamsInDb()
        const toRemove = teamsAtStart[0]

        await api
            .delete(`/api/teams/${toRemove.id}`)
            .expect(204)

        const teams = await helper.teamsInDb()

        expect(teams).not.toContain(toRemove)

        expect(teams).toHaveLength(teamsAtStart.length - 1)
    })
})

describe('Updating team', () => {

    test('updates team name', async() => {
        const teamsAtStart = await helper.teamsInDb()
        const team = teamsAtStart[0]

        const updatedTeam = {...team, name: 'Updated name'}

        await api
            .put(`/api/teams/${team.id}`)
            .send(updatedTeam)
            .expect(200)

        const teamsAtEnd = await helper.teamsInDb()
        const edited = teamsAtEnd.find(t => t.id === team.id)

        expect(edited.name).toBe('Updated name')
    })


})

describe('Viewing a certain team', () => {

    test('returns a correct team', async() => {
        const teamsAtStart = await helper.teamsInDb()
        const team = teamsAtStart[0]

        const result = await api
            .get(`/api/teams/${team.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual(JSON.parse(JSON.stringify(team)))
    })

    test('fails with statuscode 404 if non existing team id', async() => {
        const nonExistingId = await helper.nonExistingId()

        await api
            .get(`/api/teams/${nonExistingId}`)
            .expect(404)
    })

    test('fails with statuscode 400 if invalid id', async() => {
        const invalidId = 'InvalidTeamId'

        await api
            .get(`/api/teams/${invalidId}`)
            .expect(400)
    })
})

describe('Posting team', () => {

    test('is succesfull with valid team data', async() => {

        const team = {
            name: 'Kasiysi p95'
        }

        await api
            .post('/api/teams')
            .send(team)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const teamsAtEnd = await helper.teamsInDb()
        const teams = teamsAtEnd.map(t => t.name)

        expect(teams).toContain('Kasiysi p95')

        expect(teamsAtEnd).toHaveLength(helper.initialTeams.length + 1)
    })

    test('fails with statuscode 400 if missing name', async() => {
        const team = {}

        await api
            .post('/api/teams')
            .send(team)
            .expect(400)

        const playersAtEnd = await helper.teamsInDb()

        expect(playersAtEnd).toHaveLength(helper.initialTeams.length)
    })

    test('fails with status code 400 if non unique team name', async() => {

        const nonUnique = {
            name: 'Kasiysi'
        }

        await api
            .post('/api/teams')
            .send(nonUnique)
            .expect(400)

        const playersAtEnd = await helper.teamsInDb()

        expect(playersAtEnd).toHaveLength(helper.initialTeams.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})