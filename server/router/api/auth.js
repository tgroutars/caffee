const Router = require('koa-router');
const { APIError } = require('./errors');

const router = new Router();

router.post('/auth.test', async ctx => {
  const { user } = ctx.state;
  if (!user) {
    ctx.throw(new APIError('no_auth'));
    return;
  }
  ctx.send();
});

module.exports = router;
