const Router = require('koa-router');
const winston = require('winston');

const { APIError, UnknownError } = require('./errors');
const { authenticate } = require('../../lib/auth');
const { User } = require('../../models');
const authRouter = require('./auth');
const usersRouter = require('./users');
const productsRouter = require('./products');
const scopesRouter = require('./scopes');

const router = new Router();

router.options('*', async (ctx, next) => {
  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
  });
  await next();
});
router.use(async (ctx, next) => {
  ctx.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
  });
  await next();
});

router.use(async (ctx, next) => {
  ctx.send = (payload = {}) => {
    ctx.body = {
      ok: true,
      payload,
    };
  };
  await next();
});

router.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof APIError) {
      ctx.body = {
        ok: false,
        error: err.type,
      };
      return;
    }
    winston.error(err);
    ctx.throw(new UnknownError());
  }
});

router.use(async (ctx, next) => {
  const authorization = ctx.request.get('Authorization') || '';
  const [type, token] = authorization.split(' ');
  if (type === 'Bearer' && token) {
    const userId = await authenticate(token);
    if (userId) {
      ctx.state.token = token;
      ctx.state.user = await User.findById(userId);
    }
  }
  await next();
});

router.use(authRouter.routes(), authRouter.allowedMethods());
router.use(usersRouter.routes(), usersRouter.allowedMethods());
router.use(productsRouter.routes(), productsRouter.allowedMethods());
router.use(scopesRouter.routes(), scopesRouter.allowedMethods());

module.exports = router;
