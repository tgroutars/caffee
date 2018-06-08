const Router = require('koa-router');

const caffee = require('../../../../integrations/slack/commands/caffee');

const router = new Router();

router.post('/', async ctx => {
  const { body } = ctx.request;
  const {
    team_id: workspaceSlackId,
    trigger_id: triggerId,
    channel_id: channel,
    user_id: userSlackId,
  } = body;

  await caffee({ workspaceSlackId, triggerId, channel, userSlackId });

  ctx.body = '';
});

module.exports = router;
