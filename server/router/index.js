const Router = require('koa-router');

const integrationsRouter = require('./integrations');

const router = new Router();

router.use(
  '/integrations',
  integrationsRouter.routes(),
  integrationsRouter.allowedMethods(),
);

module.exports = router;
