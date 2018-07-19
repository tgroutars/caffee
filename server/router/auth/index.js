const Router = require('koa-router');

const slackAuthRouter = require('./slack');
const trelloAuthRouter = require('./trello');

const router = new Router();

router.use(
  '/slack',
  slackAuthRouter.routes(),
  slackAuthRouter.allowedMethods(),
);
router.use(
  '/trello',
  trelloAuthRouter.routes(),
  trelloAuthRouter.allowedMethods(),
);

module.exports = router;
