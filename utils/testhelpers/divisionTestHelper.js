const Division = require('../../models/division')

const initialDivisions = [
    {
        name: 'Liiga',
        teams: []
    },
    {
        name: 'Ykkönen',
        teams: []
    },
    {
        name: 'Kakkonen',
        teams: []
    }
]

const divisionsInDb = async() => {
    const divisions = await Division.find({})

    return divisions.map(division => division.toJSON())
}

const nonExistingId = async() => {
    const division = new Division({name: 'toRemove', teams: []})
    await division.save()
    await division.remove()

    return division._id.toString()
}

module.exports = {
    initialDivisions,
    divisionsInDb,
    nonExistingId
}