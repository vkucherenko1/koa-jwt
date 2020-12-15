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
    let refreshToken = uuidv4()
    await tokenService.create({ userId, refreshToken })

    return {
        token: jwt.sign({ id: userId }, config.SECRET_KEY, { algorithm: 'HS512' }),
        refreshToken: Buffer.from(refreshToken, 'utf-8').toString('base64')
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
            message: "Login success",
            data
        }
    }
})

router.post('/refresh', jwtMiddleware({ secret: config.SECRET_KEY }), bodyParser(), async ctx => {
    const refreshToken = Buffer.from(ctx.request.body.refreshToken, 'base64').toString('utf-8');
    const { id: userId } = ctx.state.user;
    const [token] = (await tokenService.find({ userId })).filter(e => bcrypt.compareSync(refreshToken, e.refreshToken))
    if (!token) {
        ctx.body = "Invalid token"
    }
    else {
        await tokenService.remove({ refreshToken: token.refreshToken })
        ctx.body = await createTokenPair(token.userId)
    }
})

router.post('/logout', jwtMiddleware({ secret: config.SECRET_KEY }), async ctx => {
    const { id: userId } = ctx.state.user;
    await tokenService.remove({ userId })
    ctx.body = {
        "success": true,
        "message": "Logout success"
    }
})

router.get('/manual/:id', async ctx => {
    const userId = ctx.params.id
    ctx.body = await createTokenPair(userId)
})


module.exports = router;