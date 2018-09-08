const Router = require('koa-router');
const SlackClient = require('@slack/client').WebClient;

const { SlackUserError } = require('../../../../lib/errors');
const { SlackWorkspace, SlackUser } = require('../../../../models');
// const {}
const { decode } = require('../../../../integrations/slack/helpers/encoding');
const caffeeRouter = require('./caffee');

const router = new Router();

router.use(async (ctx, next) => {
  const {
    text: rawText,
    team_id: workspaceSlackId,
    trigger_id: triggerId,
    channel_id: channel,
    user_id: userSlackId,
  } = ctx.request.body;
  const workspace = await SlackWorkspace.find({
    where: { slackId: workspaceSlackId },
  });
  const slackUser = await SlackUser.find({
    where: { slackId: userSlackId, workspaceId: workspace.id },
    include: ['user'],
  });
  const { user } = slackUser;

  const text = await decode(workspace)(rawText);
  Object.assign(ctx.state, {
    workspace,
    slackUser,
    user,
    text,
    rawText,
    triggerId,
    channel,
  });

  try {
    await next();
  } catch (err) {
    if (err instanceof SlackUserError) {
      const slackClient = new SlackClient(workspace.accessToken);
      await slackClient.chat.postEphemeral({
        ...err.userMessage,
        channel,
        user: userSlackId,
      });
      ctx.body = '';
      return;
    }
    throw err;
  }
});

router.use('/caffee', caffeeRouter.routes());

module.exports = router;
