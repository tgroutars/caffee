const { Product } = require('../../models');
const { Product: ProductService } = require('../../services');

const productTrelloBoardChanged = async ({ productId }) => {
  const product = await Product.findById(productId);
  await ProductService.syncTrelloBoard(product);
};

module.exports = productTrelloBoardChanged;
