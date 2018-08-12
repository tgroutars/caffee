const Router = require('koa-router');

const { APIError } = require('./errors');
const { exchangeAuthCode } = require('../../lib/auth');
const { requireAuth } = require('./middleware');

const router = new Router();

router.post('/auth.test', requireAuth, async ctx => {
  ctx.send({ userId: ctx.state.user.id });
});

router.post('/auth.login', async ctx => {
  const { userId, authCode } = ctx.request.body;
  const token = await exchangeAuthCode(userId, authCode);
  if (!token) {
    throw new APIError('invalid_auth');
  }
  ctx.send({ token });
});

module.exports = router;
