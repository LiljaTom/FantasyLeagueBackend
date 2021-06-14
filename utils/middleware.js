const logger = require('./logger')

const errorHandler = (error, req, res, next) => {

    logger.error(error.message)

    if(error.name === 'CastError') {
        return res.status(400).json({ error: 'Malformatted id'})
    } else if(error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message})
    } else if(error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'invalid token' })
    } else if(error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expired' })
    }

    next(error)
}

const tokenExtractor = (req, res, next) => {
    const auth = req.get('authorization')

    if(auth && auth.toLowerCase().startsWith('bearer ')) {
        req.token = auth.substring(7)
    }

    next()
}

const requestLogger = (req, res, next) => {
    logger.info(`Method: ${req.method}`)
    logger.info(`Path: ${req.path}`)
    logger.info(`Body: `, req.body)
    logger.info('----')

    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).json({ error: 'unknown path'})
}

module.exports = {
    errorHandler,
    requestLogger,
    unknownEndpoint,
    tokenExtractor
}