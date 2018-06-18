const Promise = require('bluebird');

const { Product } = require('../../../../models');
const { BacklogItem: BacklogItemService } = require('../../../../services');

const createCard = async payload => {
  const { card, board, list } = payload.action.data;
  const products = await Product.findAll({
    where: { trelloBoardId: board.id },
  });

  await Promise.map(products, async product => {
    await BacklogItemService.findOrCreate({
      title: card.name,
      description: card.desc,
      productId: product.id,
      trelloListRef: list.id,
      trelloRef: card.id,
    });
  });
};

module.exports = createCard;
