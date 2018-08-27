const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth, findProduct, requirePM } = require('./middleware');
const { Feedback } = require('../../models');

const router = new Router();

const serializeFeedback = feedback => ({
  ...pick(feedback, [
    'id',
    'description',
    'productId',
    'authorId',
    'createdById',
    'assignedToId',
    'roadmapItemId',
    'archivedAt',
    'archiveReason',
    'attachments',
    'scopeId',
  ]),
  author: pick(feedback.author, ['id', 'name', 'image']),
  createdBy: pick(feedback.createdBy, ['id', 'name', 'image']),
  assignedTo: pick(feedback.assignedTo, ['id', 'name', 'image']),
  roadmapItem: pick(feedback.roadmapItem, ['id', 'title']),
  scope: pick(feedback.roadmapItem, ['id', 'name']),
});

router.post(
  '/feedbacks.list',
  requireAuth,
  findProduct,
  requirePM,
  async ctx => {
    const { product } = ctx.state;
    const feedbacks = await Feedback.findAll({
      where: { productId: product.id },
      include: ['author', 'createdBy', 'assignedTo', 'roadmapItem', 'scope'],
    });
    ctx.send({
      feedbacks: feedbacks.map(serializeFeedback),
    });
  },
);

module.exports = router;
