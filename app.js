const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')

const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')


//Routers
const playersRouter = require('./controllers/players')
const teamsRouter = require('./controllers/teams')
const divisionsRouter = require('./controllers/divisions')
const gamesRouter = require('./controllers/games')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


logger.info(`Connecting to ${config.MONGODB_URI}`)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error(`Error connecting MongoDB: ${error.message}`)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

//Routers
app.use('/api/players', playersRouter)
app.use('/api/teams', teamsRouter)
app.use('/api/divisions', divisionsRouter)
app.use('/api/games', gamesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app