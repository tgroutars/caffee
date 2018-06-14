const { Product } = require('../models');

const ProductService = (/* services */) => ({
  async create({ name, image, ownerId }) {
    return Product.create({
      name,
      image,
      ownerId,
    });
  },

  async setTrelloTokens(productId, { accessToken, accessTokenSecret }) {
    return Product.update(
      {
        trelloAccessToken: accessToken,
        trelloAccessTokenSecret: accessTokenSecret,
      },
      { where: { id: productId } },
    );
  },
});

ProductService.key = 'Product';

module.exports = ProductService;
