const Router = require('koa-router');
const Boom = require('boom');

const { SlackUser, SlackWorkspace } = require('../../../models');
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

router.use(async (ctx, next) => {
  const { payload } = ctx.state;
  const {
    team: { id: workspaceSlackId },
    user: { id: userSlackId },
  } = payload;

  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId },
    include: [
      'user',
      {
        model: SlackWorkspace,
        as: 'workspace',
        where: { slackId: workspaceSlackId },
      },
    ],
  });
  if (!slackUser) {
    ctx.body = '';
    return;
  }
  ctx.state.slackUser = slackUser;
  ctx.state.user = slackUser.user;
  ctx.state.workspace = slackUser.workspace;
  await next();
});

router.post('/', async ctx => {
  const { payload, workspace, slackUser, user } = ctx.state;
  ctx.body = await handleAction(payload, { workspace, slackUser, user });
});

module.exports = router;
