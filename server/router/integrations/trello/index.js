const Router = require('koa-router');

const authRouter = require('./auth');
const webhookRouter = require('./webhook');

const router = new Router();

router.use('/auth', authRouter.routes(), authRouter.allowedMethods());
router.use('/webhook', webhookRouter.routes(), webhookRouter.allowedMethods());

module.exports = router;
