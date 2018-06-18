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

    return this.findOrCreate({
      title,
      description,
      productId,
      trelloListRef,
      trelloRef: card.id,
    });
  },

  async findOrCreate({
    title,
    description,
    productId,
    trelloListRef,
    trelloRef,
  }) {
    const [backlogItem, created] = await BacklogItem.findOrCreate({
      where: { productId, trelloRef },
      defaults: {
        title,
        description,
        trelloListRef,
      },
    });
    if (!created) {
      await backlogItem.update({ title, description, trelloListRef });
    }
    return backlogItem;
  },
});

module.exports = BacklogItemService;
