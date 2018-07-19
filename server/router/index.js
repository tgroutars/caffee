const Router = require('koa-router');

const integrationsRouter = require('./integrations');
const authRouter = require('./auth');

const router = new Router();

router.use(
  '/integrations',
  integrationsRouter.routes(),
  integrationsRouter.allowedMethods(),
);
router.use('/auth', authRouter.routes(), authRouter.allowedMethods());

module.exports = router;
