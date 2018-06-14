const Router = require('koa-router');
const Boom = require('boom');

const { handleEvent } = require('../../../integrations/slack/events');

const { SLACK_VERIFICATION_TOKEN } = process.env;

const router = new Router();

const verifyToken = async (ctx, next) => {
  const { token } = ctx.request.body;
  if (token !== SLACK_VERIFICATION_TOKEN) {
    throw Boom.unauthorized();
  }
  await next();
};

router.use(verifyToken);

router.post('/', async ctx => {
  await handleEvent(ctx.request.body);
  ctx.body = '';
});

module.exports = router;
