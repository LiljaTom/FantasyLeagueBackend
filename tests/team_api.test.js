const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const teamHelper = require('../utils/testhelpers/teamTestHelper')
const userHelper = require('../utils/testhelpers/userTestHelper')
const helper = require('../utils/testhelpers/testHelper')

const Team = require('../models/team')

let headers

beforeEach(async() => {
    await userHelper.initUsers()
    const token = await userHelper.loginAndReturnToken('root')

    headers = {
        'Authorization': `bearer ${token}`
    }
    
    await Team.deleteMany({})
    await Team.insertMany(await teamHelper.initialTeams())
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

        expect(res.body).toHaveLength(3)
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
            .set(headers)
            .expect(204)

        const teams = await helper.teamsInDb()

        expect(teams).not.toContain(toRemove)

        expect(teams).toHaveLength(teamsAtStart.length - 1)
    })

    test('fails if missing token', async() => {
        const teamsAtStart = await helper.teamsInDb()
        const toRemove = teamsAtStart[1]

        await api
            .delete(`/api/teams/${toRemove.id}`)
            .expect(401)

        const teamsAtEnd = await helper.teamsInDb()

        const teams = teamsAtEnd.map(t => t.name)
    
        expect(teams).toContain(toRemove.name)
        expect(teams).toHaveLength(teamsAtStart.length)
    })

    test('fails if not admin', async() => {
        const teamsAtStart = await helper.teamsInDb()
        const toRemove = teamsAtStart[1]

        await api
            .delete(`/api/teams/${toRemove.id}`)
            .set(headers)
            .expect({ error: 'only admin can remove the team'})
            .expect(401)

        const teamsAtEnd = await helper.teamsInDb()

        const teams = teamsAtEnd.map(t => t.name)

        expect(teams).toContain(toRemove.name)
        expect(teams).toHaveLength(teamsAtStart.length)
    })
})

describe('Updating team', () => {

    test('updates team name if admin', async() => {
        const teamsAtStart = await helper.teamsInDb()
        const team = teamsAtStart[0]

        const updatedTeam = {...team, name: 'Updated name'}

        await api
            .put(`/api/teams/${team.id}`)
            .send(updatedTeam)
            .set(headers)
            .expect(200)

        const teamsAtEnd = await helper.teamsInDb()
        const edited = teamsAtEnd.find(t => t.id === team.id)

        expect(edited.name).toBe('Updated name')
    })

    test('fails if not admin', async() => {
        const teamsAtStart = await helper.teamsInDb()
        const team = teamsAtStart[1]

        const updatedTeam = {...team, name: 'Updated name'}

        await api
            .put(`/api/teams/${team.id}`)
            .send(updatedTeam)
            .set(headers)
            .expect(401)

        const teamsAtEnd = await helper.teamsInDb()
        const edited = teamsAtEnd.find(t => t.id === team.id)

        expect(edited.name).toBe('Fireblast 4000i')
    })

    test('fails with statuscode 401 if missing token', async() => {
        const teamsAtStart = await helper.teamsInDb()
        const team = teamsAtStart[0]

        const updatedTeam = {...team, name: 'Updated name'}

        await api
            .put(`/api/teams/${team.id}`)
            .send(updatedTeam)
            .expect(401)

        const teamsAtEnd = await helper.teamsInDb()
        const edited = teamsAtEnd.find(t => t.id === team.id)

        expect(edited.name).toBe('Kasiysi')
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
        const nonExistingId = await teamHelper.nonExistingTeamId()

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

    test('is succesfull with valid data and header', async() => {
        const teamsAtStart = await helper.teamsInDb()

        const team = {
            name: 'Kasiysi p95'
        }

        await api
            .post('/api/teams')
            .send(team)
            .set(headers)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const teamsAtEnd = await helper.teamsInDb()

        const addedTeamUser = teamsAtEnd.filter(t => t.name === team.name)[0].users[0].toString()
        const users = await helper.usersInDb()

        expect(addedTeamUser).toBe(users[0].id.toString())

        const teams = teamsAtEnd.map(t => t.name)

        expect(teams).toContain('Kasiysi p95')

        expect(teamsAtEnd).toHaveLength(teamsAtStart.length + 1)
    })

    test('fails with statuscode 400 if missing name', async() => {
        const team = {}

        const teamsAtStart = await helper.teamsInDb()

        await api
            .post('/api/teams')
            .send(team)
            .set(headers)
            .expect(400)

        const teamsAtEnd = await helper.teamsInDb()

        expect(teamsAtEnd).toHaveLength(teamsAtStart.length)
    })

    test('fails with statuscode 401 if missing token', async() => {
        const team = { name: 'Kasiysi p95' }

        const teamsAtStart = await helper.teamsInDb()

        await api
            .post('/api/teams')
            .send(team)
            .expect(401)

        const teamsAtEnd = await helper.teamsInDb()

        expect(teamsAtEnd).toHaveLength(teamsAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})