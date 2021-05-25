const logger = require('./logger')

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if(error.name === 'CastError') {
        return res.status(400).json({ error: 'Malformatted id'})
    } else if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message})
    }

    next(error)
}

const requestLogger = (req, res, next) => {
    logger.info(`Method: ${req.method}`)
    logger.info(`Path: ${req.path}`)
    logger.info(`Body: ${req.body}`)
    logger.info('----')

    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).json({ error: 'unknown path'})
}

module.exports = {
    errorHandler,
    requestLogger,
    unknownEndpoint
}