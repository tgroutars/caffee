const { createCard } = require('../integrations/trello/helpers/api');
const { BacklogItem, Product } = require('../models');

const BacklogItemService = (/* services */) => ({
  async createAndSync({ title, description, productId, trelloListRef }) {
    const product = await Product.findById(productId);
    const { trelloAccessToken } = product;

    const card = await createCard(trelloAccessToken, {
      listId: trelloListRef,
      title,
      description,
    });

    return this.create({
      title,
      description,
      productId,
      trelloListRef,
      trelloRef: card.id,
    });
  },

  async create({ title, description, productId, trelloListRef, trelloRef }) {
    return BacklogItem.create({
      productId,
      title,
      description,
      trelloListRef,
      trelloRef,
    });
  },
});

module.exports = BacklogItemService;
