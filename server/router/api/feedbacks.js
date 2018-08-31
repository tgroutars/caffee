const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth, findProduct, requirePM } = require('./middleware');
const { Feedback, Product, ProductUser } = require('../../models');

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
    'commentsCount',
  ]),
  author: pick(feedback.author, ['id', 'name', 'image']),
  createdBy: pick(feedback.createdBy, ['id', 'name', 'image']),
  assignedTo: pick(feedback.assignedTo, ['id', 'name', 'image']),
  roadmapItem: pick(feedback.roadmapItem, ['id', 'title']),
  scope: pick(feedback.roadmapItem, ['id', 'name']),
});

const findFeedback = async (ctx, next) => {
  const { user } = ctx.state;
  const { feedbackId } = ctx.request.body;
  const feedback = await Feedback.findById(feedbackId, {
    include: [
      'author',
      'createdBy',
      'assignedTo',
      'roadmapItem',
      'scope',
      {
        model: Product,
        as: 'product',
        required: true,
        include: [
          {
            model: ProductUser,
            as: 'productUsers',
            required: true,
            where: { userId: user.id },
          },
        ],
      },
    ],
  });
  const { product } = feedback;
  const [productUser] = product.productUsers;
  ctx.state.feedback = feedback;
  ctx.state.product = product;
  ctx.state.productUser = productUser;
  await next();
};

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
      order: [['createdAt', 'desc']],
    });
    ctx.send({
      feedbacks: feedbacks.map(serializeFeedback),
    });
  },
);

router.post(
  '/feedbacks.info',
  requireAuth,
  findFeedback,
  requirePM,
  async ctx => {
    const { feedback } = ctx.state;
    ctx.send({ feedback: serializeFeedback(feedback) });
  },
);

module.exports = router;
