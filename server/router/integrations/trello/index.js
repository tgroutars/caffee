const Router = require('koa-router');

const webhookRouter = require('./webhook');

const router = new Router();

router.use('/webhook', webhookRouter.routes(), webhookRouter.allowedMethods());

module.exports = router;
