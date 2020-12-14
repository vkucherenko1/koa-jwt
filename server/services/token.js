const bcrypt = require('bcryptjs')

const { Token } = require('./models/models')

async function create({userId, refreshToken}) {
    try {
        const hashToken = new Token({
            userId,
            refreshToken: bcrypt.hashSync(refreshToken, 10)
        })

        await hashToken.save(e => {
            if (e) {
                console.log(e)
            }
        })
        return {
            "success": true
        }
    }
    catch (e) {
        console.log(e)
        return {
            "success": false
        }
    }
}

async function find({refreshToken}) {
    return (await Token.find({})).filter(e => bcrypt.compareSync(refreshToken, e.refreshToken));
}

async function remove(params) {
    try {
        await Token.deleteOne(params, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}

module.exports = {
    create,
    find,
    remove
}