const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth } = require('./middleware');

const router = new Router();

router.post('/users.me', requireAuth, async ctx => {
  const user = pick(ctx.state.user, ['id', 'name', 'image', 'email']);
  ctx.send({ user });
});

module.exports = router;
