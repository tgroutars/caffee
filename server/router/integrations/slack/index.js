const Router = require('koa-router');

const authRouter = require('./auth');
const actionsRouter = require('./actions');
const eventsRouter = require('./events');
const commandsRouter = require('./commands');

const router = new Router();

router.use('/auth', authRouter.routes());
router.use('/actions', actionsRouter.routes());
router.use('/events', eventsRouter.routes());
router.use('/commands', commandsRouter.routes());

module.exports = router;
