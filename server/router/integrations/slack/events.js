const Router = require('koa-router');
const Boom = require('boom');

const { handleEvent } = require('../../../integrations/slack/events');
const { SlackWorkspace } = require('../../../models');

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

router.use(async (ctx, next) => {
  const { team_id: workspaceSlackId } = ctx.request.body;
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
  });
  if (!workspace) {
    ctx.body = '';
    return;
  }
  ctx.state.workspace = workspace;
  await next();
});

router.post('/', async ctx => {
  await handleEvent(ctx.request.body, { workspace: ctx.state.workspace });
  ctx.body = '';
});

module.exports = router;
