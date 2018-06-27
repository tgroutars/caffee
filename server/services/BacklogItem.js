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
    return BacklogItemFollow.findOrCreate({
      where: {
        backlogItemId,
        userId,
      },
    });
  },

  async removeFollower(backlogItemId, userId) {
    return BacklogItemFollow.destroy({
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

  async addTags(backlogItemId, tagIds) {
    await Promise.map(tagIds, async tagId => {
      await BacklogItemTag.findOrCreate({
        where: {
          backlogItemId,
          tagId,
        },
      });
    });
  },

  async update(backlogItemId, values) {
    const newValues = pick(values, ['title', 'description']);
    await BacklogItem.update(newValues, { where: { id: backlogItemId } });
  },

  async move(backlogItemId, { oldList, newList }) {
    const [oldStage, newStage] = await Promise.all([
      BacklogStage.find({ where: { trelloRef: oldList.id } }),
      BacklogStage.find({ where: { trelloRef: newList.id } }),
    ]);
    await BacklogItem.update(
      { stageId: newStage.id },
      { where: { id: backlogItemId } },
    );
    await trigger('backlog_item_moved', {
      backlogItemId,
      oldStageId: oldStage.id,
      newStageId: newStage.id,
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

    return this.findOrCreate({
      title,
      description,
      productId,
      stageId,
      trelloRef: card.id,
      tagIds: tag && [tag.id],
    });
  },

  async findOrCreate({
    title,
    description,
    productId,
    stageId,
    trelloRef,
    tagIds,
  }) {
    const [backlogItem, created] = await BacklogItem.findOrCreate({
      where: { productId, trelloRef },
      defaults: {
        title,
        description,
        stageId,
      },
    });
    if (tagIds) {
      await this.addTags(backlogItem.id, tagIds);
    }

    if (created) {
      await trigger('backlog_item_created', { backlogItemId: backlogItem.id });
    }

    if (!created) {
      await backlogItem.update({ title, description, stageId });
    }
    return backlogItem;
  },
});

module.exports = BacklogItemService;
