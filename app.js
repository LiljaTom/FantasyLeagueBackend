const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')


//Routers
const playerRouter = require('./controllers/players')


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

//Routers
app.use('/api/players', playerRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app