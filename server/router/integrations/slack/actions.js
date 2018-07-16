const Router = require('koa-router');

const { handleAction } = require('../../../integrations/slack/actions');

const router = new Router();

const parsePayload = async (ctx, next) => {
  ctx.state.payload = JSON.parse(ctx.request.body.payload);
  await next();
};

router.use(parsePayload);

router.post('/', async ctx => {
  const { payload } = ctx.state;
  ctx.body = await handleAction(payload);
});

module.exports = router;
