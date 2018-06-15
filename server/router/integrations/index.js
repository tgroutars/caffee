const Router = require('koa-router');

const slackRouter = require('./slack');
const trelloRouter = require('./trello');

const router = new Router();

router.use('/slack', slackRouter.routes(), slackRouter.allowedMethods());
router.use('/trello', trelloRouter.routes(), trelloRouter.allowedMethods());

module.exports = router;
