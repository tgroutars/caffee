const Router = require('koa-router');

const caffee = require('../../../../integrations/slack/commands/caffee');

const router = new Router();

router.post('/', async ctx => {
  const { workspace, slackUser, user, text, triggerId, channel } = ctx.state;

  await caffee({ workspace, slackUser, user, text, triggerId, channel });

  ctx.body = '';
});

module.exports = router;
