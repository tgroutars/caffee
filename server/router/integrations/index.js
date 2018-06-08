const Router = require('koa-router');

const slackRouter = require('./slack');

const router = new Router();

router.use('/slack', slackRouter.routes());

module.exports = router;
