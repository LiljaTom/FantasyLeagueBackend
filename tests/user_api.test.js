const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('../utils/testhelpers/testHelper')
const userHelper = require('../utils/testhelpers/userTestHelper')

const bcrypt = require('bcrypt')
const User = require('../models/user')

let headers

beforeEach(async() => {
    await userHelper.initUsers()
    const token = await userHelper.loginAndReturnToken('root')

    headers = {
        'Authorization': `bearer ${token}`
    }
})

describe('Creating a new user', () => {

    test('succeeds with a unique username', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'tester',
            name: 'Test name',
            password: 'password'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
            const usersAtEnd = await helper.usersInDb()
            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

            const usernames = usersAtEnd.map(u => u.username)
            expect(usernames).toContain(newUser.username)
            expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    })

    test('fails with proper statuscode and message if username taken', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'unique',
            password: 'secret'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('`username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails with proper statuscode and message if username taken', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'unique',
            name: 'admin',
            password: 'secret'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body.error).toContain('`name` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

describe('Deleting the user', () => {

    test('is succesfull if token matches user', async() => {
        const usersAtStart = await helper.usersInDb()
        const toRemove = usersAtStart[0]

        await api
            .delete(`/api/users/${toRemove.id}`)
            .set(headers)
            .expect(204)


        const users = await helper.usersInDb()
        const usernames = users.map(u => u.username)

        expect(usernames).not.toContain(toRemove.username)

        expect(users).toHaveLength(usersAtStart.length - 1)
    })

    test('fails if missing token', async() => {
        const usersAtStart = await helper.usersInDb()
        const toRemove = usersAtStart[1]

        await api
            .delete(`/api/users/${toRemove.id}`)
            .expect({ error: 'invalid token'})
            .expect(401)

        const users = await helper.usersInDb()
        const usernames = users.map(u => u.username)
    
        expect(usernames).toContain(toRemove.username)
    
        expect(users).toHaveLength(usersAtStart.length)
    })

    test('fails if invalid token', async() => {
        const usersAtStart = await helper.usersInDb()
        const toRemove = usersAtStart[1]

        await api
            .delete(`/api/users/${toRemove.id}`)
            .set(headers)
            .expect({ error: 'user can only delete itself' })
            .expect(401)

        const users = await helper.usersInDb()
        const usernames = users.map(u => u.username)
    
        expect(usernames).toContain(toRemove.username)
    
        expect(users).toHaveLength(usersAtStart.length)
    })
})

describe('Viewing a certain user', () => {

    test('returns a correct user', async() => {
        const usersAtStart = await helper.usersInDb()
        const user = usersAtStart[0]

        const result = await api
            .get(`/api/users/${user.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

            expect(result.body).toEqual(JSON.parse(JSON.stringify(user)))
    })

    test('fails with status code 404 if non existing id', async() => {
        const nonExistingId = await userHelper.nonExistingUserId()

        await api
            .get(`/api/divisions/${nonExistingId}`)
            .expect(404)
    })

    test('fails with statuscode 400 if invalid id', async() => {
        const invalidId = 'InvalidUserId'

        await api
            .get(`/api/users/${invalidId}`)
            .expect(400)
    })
})

describe('Updating user', () => {

    test('updates username if valid token', async() => {
        const usersAtStart = await helper.usersInDb()
        const user = usersAtStart[0]

        const updatedUser = {...user, username: 'Updated username'}

        await api
            .put(`/api/users/${user.id}`)
            .send(updatedUser)
            .set(headers)
            .expect(200)

        const usersAtEnd = await helper.usersInDb()
        const edited = usersAtEnd.find(u => u.id === user.id)

        expect(edited.username).toBe('Updated username')
    })

    test('fails if invalid token', async() => {
        const usersAtStart = await helper.usersInDb()
        const user = usersAtStart[1]

        const updatedUser = {...user, username: 'Updated username'}

        await api
            .put(`/api/users/${user.id}`)
            .send(updatedUser)
            .set(headers)
            .expect({ error: 'user can only edit itself' })
            .expect(401)

        const usersAtEnd = await helper.usersInDb()
        const edited = usersAtEnd.find(u => u.id === user.id)

        expect(edited.username).toBe('username')
    })

    test('fails if missing token', async() => {
        const usersAtStart = await helper.usersInDb()
        const user = usersAtStart[1]

        const updatedUser = {...user, username: 'Updated username'}

        await api
            .put(`/api/users/${user.id}`)
            .send(updatedUser)
            .expect({ error: 'invalid token' })
            .expect(401)

        const usersAtEnd = await helper.usersInDb()
        const edited = usersAtEnd.find(u => u.id === user.id)

        expect(edited.username).toBe('username')
    })
})

afterAll(() => {
    mongoose.connection.close()
})