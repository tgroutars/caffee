const path = require('path');
const Router = require('koa-router');
const sendFile = require('koa-sendfile');

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

router.get('*', async ctx => {
  await sendFile(ctx, path.join(__dirname, '../../dist/index.html'));
});

module.exports = router;
