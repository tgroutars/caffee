const { Product } = require('../models');

const ProductService = (/* services */) => ({
  async create({ name, image, ownerId }) {
    return Product.create({
      name,
      image,
      ownerId,
    });
  },
});

ProductService.key = 'Product';

module.exports = ProductService;
