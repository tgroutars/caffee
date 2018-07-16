const Router = require('koa-router');

const { handleEvent } = require('../../../integrations/slack/events');

const router = new Router();

// Verify URL
router.use(async (ctx, next) => {
  const { body } = ctx.request;
  const { type, challenge } = body;
  if (type === 'url_verification') {
    ctx.body = challenge;
    return;
  }
  await next();
});

router.post('/', async ctx => {
  await handleEvent(ctx.request.body);
  ctx.body = '';
});

module.exports = router;
