const Router = require('koa-router');

const integrationsRouter = require('./integrations');
const authRouter = require('./auth');
const signupRouter = require('./signup');

const router = new Router();

router.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'https://caffee.io');
  await next();
});
router.use('/signup', signupRouter.routes(), signupRouter.allowedMethods());
router.use(
  '/integrations',
  integrationsRouter.routes(),
  integrationsRouter.allowedMethods(),
);
router.use('/auth', authRouter.routes(), authRouter.allowedMethods());

module.exports = router;
