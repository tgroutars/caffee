const pick = require('lodash/pick');

const { createCard } = require('../integrations/trello/helpers/api');
const { BacklogItem, Product, sequelize } = require('../models');
const { trigger } = require('../eventQueue/eventQueue');

const BacklogItemService = (/* services */) => ({
  async update(backlogItemId, values) {
    const newValues = pick(values, ['title', 'description']);
    await BacklogItem.update(newValues, { where: { id: backlogItemId } });
  },

  async move(backlogItemId, { oldList, newList }) {
    await BacklogItem.update(
      { trelloListRef: newList.id },
      { where: { id: backlogItemId } },
    );
    await trigger('backlog_item_moved', {
      backlogItemId,
      oldList,
      newList,
    });
  },

  async unarchive(backlogItemId) {
    await BacklogItem.update(
      { archivedAt: null },
      { where: { id: backlogItemId } },
    );
  },

  async archive(backlogItemId) {
    await BacklogItem.update(
      { archivedAt: sequelize.fn('NOW') },
      { where: { id: backlogItemId } },
    );
  },

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
