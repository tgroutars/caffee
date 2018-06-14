const Router = require('koa-router');

const slackRouter = require('./slack');
const trelloRouter = require('./trello');

const router = new Router();

router.use('/slack', slackRouter.routes());
router.use('/trello', trelloRouter.routes());

module.exports = router;
