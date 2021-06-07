const Division = require('../../models/division')

const helper = require('../testhelpers/testHelper')

const initialDivisions = async() => {
    return[
        {
            name: 'Liiga',
            teams: [
                await helper.teamId('Hjk'),
                await helper.teamId('Tps')
            ]
        },
        {
            name: 'Ykkönen',
            teams: [
                await helper.teamId('Haka'),
                await helper.teamId('Vjs')
            ]
        },
        {
            name: 'Kakkonen',
            teams: [
                await helper.teamId('Fc Espoo'),
                await helper.teamId('Tpv')
            ]
        }
    ]
}


const nonExistingId = async() => {
    const division = new Division({name: 'toRemove', teams: []})
    await division.save()
    await division.remove()

    return division._id.toString()
}

module.exports = {
    initialDivisions,
    nonExistingId
}