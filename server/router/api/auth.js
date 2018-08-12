const Router = require('koa-router');

const { APIError } = require('./errors');
const { exchangeAuthCode } = require('../../lib/auth');

const router = new Router();

router.post('/auth.test', async ctx => {
  const { user } = ctx.state;
  if (!user) {
    throw new APIError('no_auth');
  }
  ctx.send();
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
