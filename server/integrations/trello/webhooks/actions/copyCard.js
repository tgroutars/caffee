const Promise = require('bluebird');

const { Product, RoadmapStage } = require('../../../../models');
const { RoadmapItem: RoadmapItemService } = require('../../../../services');

const copyCard = async payload => {
  const { card, board, list } = payload.action.data;
  const products = await Product.findAll({
    where: { trelloBoardId: board.id },
  });

  await Promise.map(products, async product => {
    const stage = await RoadmapStage.find({
      where: { productId: product.id, trelloRef: list.id },
    });
    await RoadmapItemService.findOrCreate({
      title: card.name,
      description: card.desc,
      productId: product.id,
      stageId: stage.id,
      trelloRef: card.id,
    });
  });
};

module.exports = copyCard;
