const pick = require('lodash/pick');
const Promise = require('bluebird');

const { createCard } = require('../integrations/trello/helpers/api');
const {
  BacklogItem,
  Product,
  BacklogItemTag,
  Tag,
  BacklogItemFollow,
  BacklogStage,
  sequelize,
} = require('../models');
const { trigger } = require('../eventQueue/eventQueue');

const BacklogItemService = (/* services */) => ({
  async addFollower(backlogItemId, userId) {
    await BacklogItemFollow.findOrCreate({
      where: {
        backlogItemId,
        userId,
      },
    });
  },

  async removeTag(backlogItemId, tagId) {
    await BacklogItemTag.destroy({
      where: {
        backlogItemId,
        tagId,
      },
    });
  },

  async addTag(backlogItemId, tagId) {
    await BacklogItemTag.findOrCreate({
      where: {
        backlogItemId,
        tagId,
      },
    });
  },

  async update(backlogItemId, values) {
    const newValues = pick(values, ['title', 'description']);
    await BacklogItem.update(newValues, { where: { id: backlogItemId } });
  },

  async move(backlogItemId, { oldList, newList }) {
    const [oldStage, newStage] = Promise.all([
      BacklogStage.find({ where: { trelloRef: oldList.id } }),
      BacklogStage.find({ where: { trelloRef: newList.id } }),
    ]);
    await BacklogItem.update(
      { stageId: newStage.id },
      { where: { id: backlogItemId } },
    );
    await trigger('backlog_item_moved', {
      backlogItemId,
      oldStage,
      newStage,
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

  async createAndSync({ title, description, productId, tagId, stageId }) {
    const product = await Product.findById(productId);
    const { trelloAccessToken } = product;

    const tag = tagId ? await Tag.findById(tagId) : null;
    const stage = await BacklogStage.findById(stageId);

    const card = await createCard(trelloAccessToken, {
      listId: stage.trelloRef,
      labelIds: tag ? [tag.trelloRef] : [],
      title,
      description,
    });

    const backlogItem = await BacklogItem.create({
      title,
      description,
      productId,
      stageId,
      trelloRef: card.id,
    });
    if (tagId) {
      await this.addTag(backlogItem.id, tagId);
    }
    await trigger('backlog_item_created', { backlogItemId: backlogItem.id });
    return backlogItem;
  },

  async findOrCreate({ title, description, productId, stageId, trelloRef }) {
    const [backlogItem, created] = await BacklogItem.findOrCreate({
      where: { productId, trelloRef },
      defaults: {
        title,
        description,
        stageId,
      },
    });
    if (!created) {
      await backlogItem.update({ title, description, stageId });
    }
    return backlogItem;
  },
});

module.exports = BacklogItemService;
