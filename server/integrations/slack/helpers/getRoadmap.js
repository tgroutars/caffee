const Promise = require('bluebird');
const ceil = require('lodash/ceil');

const {
  Product,
  RoadmapItem,
  RoadmapStage,
  Sequelize,
} = require('../../../models');

// TODO: Promise.all
const getRoadmap = async (
  productId,
  { nbItems = 5, page = 0, stageId } = {},
) => {
  const product = await Product.findById(productId);

  const offset = page * 5;
  const where = { productId };
  if (stageId) {
    where.stageId = stageId;
  }
  const roadmapItems = await RoadmapItem.findAll({
    where,
    include: ['stage'],
    order: [[Sequelize.literal('stage.position'), 'ASC']],
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
  return {
    pageCount,
    roadmapItems,
    roadmapItemCount,
    product,
    stages,
    filterStage,
  };
};

module.exports = getRoadmap;
