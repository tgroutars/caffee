const Router = require('koa-router');

const optionsLoad = require('../../../integrations/slack/options-load');

const router = new Router();

const parsePayload = async (ctx, next) => {
  ctx.state.payload = JSON.parse(ctx.request.body.payload);
  await next();
};

router.use(parsePayload);

router.post('/', async ctx => {
  ctx.body = await optionsLoad(ctx.state.payload);
});

module.exports = router;
