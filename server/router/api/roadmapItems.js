const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth, findProduct, requirePM } = require('./middleware');
const { Sequelize, RoadmapItem } = require('../../models');
const { RoadmapItem: RoadmapItemService } = require('../../services');

const { Op } = Sequelize;

const router = new Router();

const serializeRoadmapItem = roadmapItem => ({
  ...pick(roadmapItem, [
    'id',
    'title',
    'description',
    'productId',
    'trelloRef',
    'stageId',
    'archivedAt',
    'trelloCardURL',
    'followerCount',
    'attachments',
    'createdAt',
  ]),
  stage: roadmapItem.stage
    ? pick(roadmapItem.stage, ['id', 'name'])
    : undefined,
});

router.post(
  '/roadmapItems.list',
  requireAuth,
  findProduct,
  requirePM,
  async ctx => {
    const { product } = ctx.state;
    const { includeArchived = false } = ctx.request.body;
    const { query = '' } = ctx.request.body;

    const searchString = `%${query.replace('%', '\\%')}%`;
    const where = {
      [Op.or]: {
        title: { [Op.iLike]: searchString },
        description: { [Op.iLike]: searchString },
      },
      productId: product.id,
    };
    if (!includeArchived) {
      where.archivedAt = null;
    }

    const roadmapItems = await RoadmapItem.findAll({
      where,
      include: ['stage'],
      order: [['createdAt', 'desc']],
    });
    ctx.send({
      roadmapItems: roadmapItems.map(serializeRoadmapItem),
    });
  },
);

router.post(
  '/roadmapItems.create',
  requireAuth,
  findProduct,
  requirePM,
  async ctx => {
    const { productId, title, description, tagIds, stageId } = ctx.request.body;
    const roadmapItem = await RoadmapItemService.createAndSync({
      productId,
      title,
      description,
      tagIds,
      stageId,
    });
    ctx.send({
      roadmapItem: serializeRoadmapItem(roadmapItem),
    });
  },
);

module.exports = router;
