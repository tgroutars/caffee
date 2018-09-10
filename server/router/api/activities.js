const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth, findProduct, requirePM } = require('./middleware');
const { Sequelize, Activity } = require('../../models');

const { Op } = Sequelize;

const router = new Router();

const serializeActivity = activity => ({
  ...pick(activity, [
    'id',
    'type',
    'roadmapItemId',
    'productId',
    'activity',
    'sentAt',
    'discardedAt',
    'createdAt',
    'updatedAt',
  ]),
  roadmapItem: activity.roadmapItem
    ? pick(activity.roadmapItem, ['id', 'title'])
    : undefined,
});

router.post(
  '/activities.list',
  requireAuth,
  findProduct,
  requirePM,
  async ctx => {
    const { product } = ctx.state;
    const {
      includeDiscarded = true,
      includeSent = true,
      includePending = true,
    } = ctx.request.body;
    const where = { productId: product.id };
    if (!includeDiscarded) {
      where.discardedAt = null;
    }
    if (!includeSent) {
      where.sentAt = null;
    }
    if (!includePending) {
      where[Op.and] = {
        discardedAt: { [Op.ne]: null },
        sentAt: { [Op.ne]: null },
      };
    }
    const activities = await Activity.findAll({
      where,
      include: ['roadmapItem'],
    });
    ctx.send({
      activities: activities.map(serializeActivity),
    });
  },
);

module.exports = router;
