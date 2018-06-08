const Router = require('koa-router');

const { verifyToken } = require('../../../../middleware/slack');
const caffeeRouter = require('./caffee');

const router = new Router();

router.use(verifyToken);

router.use('/caffee', caffeeRouter.routes());

module.exports = router;
