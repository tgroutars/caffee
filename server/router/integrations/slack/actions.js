const Router = require('koa-router');
const Boom = require('boom');

const { handleAction } = require('../../../integrations/slack/actions');

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
  await handleAction(ctx.state.payload);
  ctx.body = '';
});

module.exports = router;
