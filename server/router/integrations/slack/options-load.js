const Router = require('koa-router');
const Boom = require('boom');

const optionsLoad = require('../../../integrations/slack/options-load');

const { SLACK_VERIFICATION_TOKEN } = process.env;

const router = new Router();

const parsePayload = async (ctx, next) => {
  ctx.state.payload = JSON.parse(ctx.request.body.payload);
  await next();
};

const verifyToken = async (ctx, next) => {
  const { token } = ctx.state.payload;
  if (token !== SLACK_VERIFICATION_TOKEN) {
    throw Boom.unauthorized();
  }
  await next();
};

router.use(parsePayload, verifyToken);

router.post('/', async ctx => {
  ctx.body = await optionsLoad(ctx.state.payload);
});

module.exports = router;
