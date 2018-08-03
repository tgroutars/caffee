const Promise = require('bluebird');

const { Product } = require('../../../../models');
const { Product: ProductService } = require('../../../../services');

const createLabel = async payload => {
  const { label, board } = payload.action.data;
  const products = await Product.findAll({
    where: { trelloBoardId: board.id },
  });

  await Promise.map(products, async product => {
    await ProductService.createTag(product.id, {
      name: label.name || label.color,
      trelloRef: label.id,
    });
  });
};

module.exports = createLabel;
