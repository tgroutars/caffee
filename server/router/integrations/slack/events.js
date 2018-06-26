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
  const { body } = ctx.request;
  const { type, challenge } = body;
  if (type === 'url_verification') {
    ctx.body = challenge;
    return;
  }
  await handleEvent(body);
  ctx.body = '';
});

module.exports = router;
