const crypto = require('crypto');
const Router = require('koa-router');

const actionsRouter = require('./actions');
const eventsRouter = require('./events');
const commandsRouter = require('./commands');
const optionsLoadRouter = require('./options-load');

const { SLACK_SIGNING_SECRET } = process.env;

const router = new Router();

router.use(async (ctx, next) => {
  const {
    headers: {
      'x-slack-signature': requestSignature,
      'x-slack-request-timestamp': requestTimestamp,
    },
    rawBody: requestBody,
  } = ctx.request;
  const unhashedSignature = `v0:${requestTimestamp}:${requestBody}`;
  const hmac = crypto
    .createHmac('sha256', SLACK_SIGNING_SECRET)
    .update(unhashedSignature);
  const signature = `v0=${hmac.digest('hex')}`;
  if (signature !== requestSignature) {
    ctx.throw(401);
  }
  await next();
});

router.use('/actions', actionsRouter.routes(), actionsRouter.allowedMethods());
router.use('/events', eventsRouter.routes(), eventsRouter.allowedMethods());
router.use(
  '/commands',
  commandsRouter.routes(),
  commandsRouter.allowedMethods(),
);
router.use(
  '/options-load',
  optionsLoadRouter.routes(),
  optionsLoadRouter.allowedMethods(),
);

module.exports = router;
