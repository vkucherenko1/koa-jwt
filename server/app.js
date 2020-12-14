const Koa = require('koa')
const Router = require('koa-router')
const mongoose = require('mongoose')

const config = require('./config')

const authModule = require('./modules/auth')
const registerModule = require('./modules/register')

function startApp() {
    const app = new Koa();
    const router = new Router();

    mongoose.connect(config.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });

    router.get('/', ctx => {
        ctx.body = 'OK'
    })

    router.use('/auth', authModule.routes());
    router.use('/register', registerModule.routes())

    app.use(router.allowedMethods());
    app.use(router.routes());

    return app
}

startApp().listen(config.PORT)

module.exports = startApp;