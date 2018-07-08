const Promise = require('bluebird');
const ceil = require('lodash/ceil');

const {
  Product,
  RoadmapItem,
  RoadmapStage,
  ProductUser,
  Sequelize,
} = require('../../../models');

// TODO: Promise.all
const getRoadmap = async (
  productId,
  userId,
  { nbItems = 5, page = 0, order = 'date', stageId } = {},
) => {
  const product = await Product.findById(productId);

  const offset = page * 5;
  const where = { productId };
  if (stageId) {
    where.stageId = stageId;
  }
  const orderBy = [[Sequelize.literal('stage.position'), 'ASC']];
  switch (order) {
    case 'date':
      orderBy.unshift(['createdAt', 'DESC']);
      break;
    case 'followers':
      orderBy.unshift(['followerCount', 'DESC']);
      break;
    default:
  }

  const roadmapItems = await RoadmapItem.findAll({
    where,
    include: ['stage'],
    order: orderBy,
    limit: nbItems,
    offset,
  });
  const roadmapItemCount = await RoadmapItem.count({ where });
  const stages = await RoadmapStage.findAll({ where: { productId } });
  const filterStage = stageId && stages.find(stage => stage.id === stageId);
  const pageCount = ceil(roadmapItemCount / nbItems);
  await Promise.map(roadmapItems, async roadmapItem => {
    roadmapItem.followers = await roadmapItem.getFollowers();
  });

  const productUser = await ProductUser.find({ where: { productId, userId } });
  const { isPM } = productUser;

  return {
    pageCount,
    roadmapItems,
    roadmapItemCount,
    product,
    stages,
    filterStage,
    isPM,
  };
};

module.exports = getRoadmap;
