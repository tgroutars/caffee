const Router = require('koa-router');

const authRouter = require('./auth');
const actionsRouter = require('./actions');
const commandsRouter = require('./commands');

const router = new Router();

router.use('/auth', authRouter.routes());
router.use('/actions', actionsRouter.routes());
router.use('/commands', commandsRouter.routes());

module.exports = router;
