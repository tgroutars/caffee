const Router = require('koa-router');

const caffeeRouter = require('./caffee');

const router = new Router();

router.use('/caffee', caffeeRouter.routes());

module.exports = router;
