const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const signupService = require('../services/register')

const router = new Router();

router.post('/', bodyParser(), async ctx => {
    try {
        ctx.body = await signupService(ctx.request.body)
    }
    catch (e) {
        ctx.body = e
    }
})

module.exports = router