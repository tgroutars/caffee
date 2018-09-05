const Router = require('koa-router');
const pick = require('lodash/pick');
const trim = require('lodash/trim');

const { APIError } = require('./errors');
const { requireAuth, findProduct, requirePM } = require('./middleware');
const {
  Feedback,
  Product,
  ProductUser,
  FeedbackComment,
} = require('../../models');
const {
  Feedback: FeedbackService,
  FeedbackComment: FeedbackCommentService,
} = require('../../services');

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
    'isArchived',
    'createdAt',
  ]),
  author: pick(feedback.author, ['id', 'name', 'image']),
  createdBy: pick(feedback.createdBy, ['id', 'name', 'image']),
  assignedTo: pick(feedback.assignedTo, ['id', 'name', 'image']),
  roadmapItem: pick(feedback.roadmapItem, ['id', 'title']),
  scope: pick(feedback.roadmapItem, ['id', 'name']),
});
const serializeComment = comment => ({
  ...pick(comment, ['id', 'text', 'authorId', 'attachments', 'createdAt']),
  author: pick(comment.author, ['id', 'name', 'image']),
});

const findFeedback = async (ctx, next) => {
  const { user } = ctx.state;
  const { feedbackId } = ctx.request.body;
  const feedback = await Feedback.findById(feedbackId, {
    include: [
      'comments',
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
    const comments = await FeedbackComment.findAll({
      where: { feedbackId: feedback.id },
      include: ['author'],
    });
    ctx.send({
      feedback: {
        ...serializeFeedback(feedback),
        comments: comments.map(serializeComment),
      },
    });
  },
);

router.post(
  '/feedbacks.setRoadmapItem',
  requireAuth,
  findFeedback,
  requirePM,
  async ctx => {
    const { feedback, product, user } = ctx.state;
    if (feedback.isArchived || feedback.roadmapItemId) {
      throw new APIError('feedback_already_processed');
    }
    const { roadmapItemId } = ctx.request.body;
    const [roadmapItem] = await product.getRoadmapItems({
      where: { id: roadmapItemId },
    });
    if (!roadmapItem) {
      throw new APIError('roadmap_item_not_found');
    }
    await FeedbackService.setRoadmapItem(feedback.id, {
      roadmapItemId,
      processedById: user.id,
    });
    await feedback.reload({
      include: [
        'comments',
        'author',
        'createdBy',
        'assignedTo',
        'roadmapItem',
        'scope',
      ],
    });
    ctx.send({ feedback: serializeFeedback(feedback) });
  },
);

router.post(
  '/feedbacks.archive',
  requireAuth,
  findFeedback,
  requirePM,
  async ctx => {
    const { feedback, user } = ctx.state;
    const { archiveReason } = ctx.request.body;
    if (feedback.isArchived || feedback.roadmapItemId) {
      throw new APIError('feedback_already_processed');
    }
    await FeedbackService.archive(feedback.id, {
      archiveReason,
      archivedById: user.id,
    });
    await feedback.reload({
      include: [
        'comments',
        'author',
        'createdBy',
        'assignedTo',
        'roadmapItem',
        'scope',
      ],
    });
    ctx.send({ feedback: serializeFeedback(feedback) });
  },
);

router.post('/feedbacks.addComment', requireAuth, findFeedback, async ctx => {
  const { feedback, user } = ctx.state;
  const text = trim(ctx.request.body.text);
  if (!text) {
    throw new APIError('no_text');
  }
  const comment = await FeedbackCommentService.create({
    text,
    authorId: user.id,
    feedbackId: feedback.id,
  });
  await comment.reload({ include: ['author'] });
  ctx.send({ comment: serializeComment(comment) });
});

module.exports = router;
