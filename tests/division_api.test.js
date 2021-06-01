const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('../utils/testhelpers/divisionTestHelper')
const Division = require('../models/division')

beforeEach(async() => {
    await Division.deleteMany({})
    await Division.insertMany(helper.initialDivisions)
})

describe('Get request to the division api', () => {

    test('divisions are returned as json', async() => {
        await api
            .get('/api/divisions')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all divisions are returned', async() => {
        const res = await api.get('/api/divisions')

        expect(res.body).toHaveLength(helper.initialDivisions.length)
    })


})

describe('Delete request to the division api', () => {

    test('removes divison and behaves correctly', async() => {
        const divisionsAtStart = await helper.divisionsInDb()
        const toRemove = divisionsAtStart[0]

        await api
            .delete(`/api/divisions/${toRemove.id}`)
            .expect(204)

        const divisions = await helper.divisionsInDb()

        expect(divisions).not.toContain(toRemove)

        expect(divisions).toHaveLength(helper.initialDivisions.length - 1)
    })
})

describe('Updating division', () => {

    test('updates division name', async() => {
        const divisionsAtStart = await helper.divisionsInDb()
        const division = divisionsAtStart[0]

        const updatedDivision = {...division, name: 'Updated division'}

        await api
            .put(`/api/divisions/${division.id}`)
            .send(updatedDivision)
            .expect(200)

        const divisionsAtEnd = await helper.divisionsInDb()
        const edited = divisionsAtEnd.find(d => d.id === division.id)

        expect(edited.name).toBe('Updated division')
    })
})

describe('Viewing a certain division', () => {

    test('returns a correct division', async() => {
        const divisionsAtStart = await helper.divisionsInDb()
        const division = divisionsAtStart[0]

        const result = await api
            .get(`/api/divisions/${division.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(result.body).toEqual(JSON.parse(JSON.stringify(division)))
    })

    test('fails with status code 404 if non existing id', async() => {
        const nonExistingId = await helper.nonExistingId()

        await api
            .get(`/api/divisions/${nonExistingId}`)
            .expect(404)

    })

    test('fails with status code 400 if invalid id', async() => {
        const invalidId = 'invalidDivisionId'

        await api
            .get(`/api/divisions/${invalidId}`)
            .expect(400)
    })
})

describe('Posting division', () => {

    test('is succesfull with valid data', async() => {
        const division = {
            name: 'new division'
        }

        await api
            .post('/api/divisions')
            .send(division)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const divisionsAtEnd = await helper.divisionsInDb()
        const divisionNames = divisionsAtEnd.map(division => division.name)

        expect(divisionNames).toContain('new division')

        expect(divisionsAtEnd).toHaveLength(helper.initialDivisions.length + 1)
    })

    test('fails with status code 400 if missing name', async() => {
        const invalidDivision = {}

        await api
            .post('/api/divisions')
            .send(invalidDivision)
            .expect(400)

        const divisionsAtEnd = await helper.divisionsInDb()

        expect(divisionsAtEnd).toHaveLength(helper.initialDivisions.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})