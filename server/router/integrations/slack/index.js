const Router = require('koa-router');

const authRouter = require('./auth');

const router = new Router();

router.use('/auth', authRouter.routes());

module.exports = router;
