const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const bcrypt = require('bcryptjs')
const jwtMiddleware = require('koa-jwt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const config = require('../config')

const tokenService = require('../services/token')
const userService = require('../services/user')

const router = new Router()

async function createTokenPair(userId) {
    const refreshToken = uuidv4();
    await tokenService.create({ userId, refreshToken })

    return {
        token: jwt.sign({ id: userId }, config.SECRET_KEY, { algorithm: 'HS512' }),
        refreshToken
    }
}

router.post('/login', bodyParser(), async ctx => {
    const { login, password } = ctx.request.body;

    const [user] = await userService.find(login)
    if (!user || !bcrypt.compareSync(password, user.password)) {
        ctx.status = 403;
    }
    else {
        const data = await createTokenPair(user.id)
        ctx.body = {
            message: 'SUCCESS LOGIN',
            data
        }
    }
})

router.post('/refresh', bodyParser(), async ctx => {
    const { refreshToken } = ctx.request.body
    const [token] = await tokenService.find({ refreshToken })
    if (!token) {
        ctx.body = 'Invalid token'
    }
    else {
        await tokenService.remove({ refreshToken: token.refreshToken })
        ctx.body = await createTokenPair(token.userId)
    }
})

router.post('/logout', jwtMiddleware({ secret: config.SECRET_KEY }), async ctx => {
    const { id: userId } = ctx.state.user;
    await tokenService.remove({userId})
    ctx.body = {
        "success": true
    }
})

module.exports = router;