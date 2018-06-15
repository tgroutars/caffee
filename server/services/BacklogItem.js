const { createCard } = require('../integrations/trello/helpers/api');
const { BacklogItem, Product } = require('../models');

const BacklogItemService = (/* services */) => ({
  async create({ title, description, productId, trelloListRef }) {
    const product = await Product.findById(productId);
    const { trelloAccessToken } = product;

    const card = await createCard(trelloAccessToken, {
      listId: trelloListRef,
      title,
      description,
    });

    const backlogItem = await BacklogItem.create({
      productId,
      title,
      description,
      trelloListRef,
      trelloRef: card.id,
    });
    return backlogItem;
  },
});

module.exports = BacklogItemService;
