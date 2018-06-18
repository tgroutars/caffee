const Router = require('koa-router');

const { handleWebhook } = require('../../../integrations/trello/webhooks');

const router = new Router();

router.head('/', async ctx => {
  ctx.body = '';
});

router.post('/', async ctx => {
  await handleWebhook(ctx.request.body);
  ctx.body = '';
});

module.exports = router;
