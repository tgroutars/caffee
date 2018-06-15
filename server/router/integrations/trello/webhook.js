const Router = require('koa-router');

const router = new Router();

router.head('/', async ctx => {
  ctx.body = '';
});

router.post('/', async ctx => {
  ctx.body = '';
});

module.exports = router;
