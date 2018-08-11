const path = require('path');
const Router = require('koa-router');
const sendFile = require('koa-sendfile');

const integrationsRouter = require('./integrations');
const authRouter = require('./auth');
const signupRouter = require('./signup');
const apiRouter = require('./api');

const router = new Router();

router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
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
