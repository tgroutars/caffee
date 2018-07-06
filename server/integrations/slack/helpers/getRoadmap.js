const Promise = require('bluebird');
const ceil = require('lodash/ceil');

const { Product, RoadmapItem, Sequelize } = require('../../../models');

const getRoadmap = async (productId, { nbItems = 5, page = 0 } = {}) => {
  const product = await Product.findById(productId);

  const offset = page * 5;
  const roadmapItems = await RoadmapItem.findAll({
    where: { productId },
    include: ['stage'],
    order: [[Sequelize.literal('stage.position'), 'ASC']],
    limit: nbItems,
    offset,
  });
  const roadmapItemCount = await RoadmapItem.count({
    where: { productId },
  });

  const isLastPage = roadmapItemCount <= offset + roadmapItems.length;
  const pageCount = ceil(roadmapItemCount / nbItems);
  await Promise.map(roadmapItems, async roadmapItem => {
    roadmapItem.followers = await roadmapItem.getFollowers();
  });
  return {
    isLastPage,
    pageCount,
    roadmapItems,
    roadmapItemCount,
    product,
  };
};

module.exports = getRoadmap;
