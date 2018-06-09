const Router = require('koa-router');
const Boom = require('boom');

const caffeeRouter = require('./caffee');

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
router.use('/caffee', caffeeRouter.routes());

module.exports = router;
