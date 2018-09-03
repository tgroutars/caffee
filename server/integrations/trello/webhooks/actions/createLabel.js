const Promise = require('bluebird');

const { Product } = require('../../../../models');
const { Tag: TagService } = require('../../../../services');

const createLabel = async payload => {
  const { label, board } = payload.action.data;
  const products = await Product.findAll({
    where: { trelloBoardId: board.id },
  });

  await Promise.map(products, async product => {
    await TagService.findOrCreate({
      productId: product.id,
      trelloRef: label.id,
      name: label.name || label.color,
    });
  });
};

module.exports = createLabel;
