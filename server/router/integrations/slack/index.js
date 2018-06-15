const Router = require('koa-router');

const authRouter = require('./auth');
const actionsRouter = require('./actions');
const eventsRouter = require('./events');
const commandsRouter = require('./commands');

const router = new Router();

router.use('/auth', authRouter.routes(), authRouter.allowedMethods());
router.use('/actions', actionsRouter.routes(), actionsRouter.allowedMethods());
router.use('/events', eventsRouter.routes(), eventsRouter.allowedMethods());
router.use(
  '/commands',
  commandsRouter.routes(),
  commandsRouter.allowedMethods(),
);

module.exports = router;
