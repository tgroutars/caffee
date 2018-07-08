const pick = require('lodash/pick');
const Promise = require('bluebird');

const { createCard } = require('../integrations/trello/helpers/api');
const {
  RoadmapItem,
  Product,
  RoadmapItemTag,
  Tag,
  RoadmapItemFollow,
  RoadmapStage,
  sequelize,
} = require('../models');
const { trigger } = require('../eventQueue/eventQueue');

const RoadmapItemService = (/* services */) => ({
  async addFollower(roadmapItemId, userId) {
    const [roadmapItemFollow, created] = await RoadmapItemFollow.findOrCreate({
      where: {
        roadmapItemId,
        userId,
      },
    });
    if (created) {
      await RoadmapItem.increment('followerCount', {
        where: { id: roadmapItemId },
      });
    }
    return [roadmapItemFollow, created];
  },

  async removeFollower(roadmapItemId, userId) {
    const destroyCount = await RoadmapItemFollow.destroy({
      where: {
        roadmapItemId,
        userId,
      },
    });
    if (destroyCount) {
      await RoadmapItem.decrement('followerCount', {
        where: { id: roadmapItemId },
      });
    }
    return !!destroyCount;
  },

  async removeTag(roadmapItemId, tagId) {
    await RoadmapItemTag.destroy({
      where: {
        roadmapItemId,
        tagId,
      },
    });
  },

  async addTags(roadmapItemId, tagIds) {
    await Promise.map(tagIds, async tagId => {
      await RoadmapItemTag.findOrCreate({
        where: {
          roadmapItemId,
          tagId,
        },
      });
    });
  },

  async update(roadmapItemId, values) {
    const newValues = pick(values, ['title', 'description']);
    await RoadmapItem.update(newValues, { where: { id: roadmapItemId } });
  },

  async move(roadmapItemId, { oldList, newList }) {
    const [oldStage, newStage] = await Promise.all([
      RoadmapStage.find({ where: { trelloRef: oldList.id } }),
      RoadmapStage.find({ where: { trelloRef: newList.id } }),
    ]);
    await RoadmapItem.update(
      { stageId: newStage.id },
      { where: { id: roadmapItemId } },
    );
    await trigger('roadmap_item_moved', {
      roadmapItemId,
      oldStageId: oldStage.id,
      newStageId: newStage.id,
    });
  },

  async unarchive(roadmapItemId) {
    await RoadmapItem.update(
      { archivedAt: null },
      { where: { id: roadmapItemId } },
    );
  },

  async archive(roadmapItemId) {
    await RoadmapItem.update(
      { archivedAt: sequelize.fn('NOW') },
      { where: { id: roadmapItemId } },
    );
  },

  async createAndSync({ title, description, productId, tagId, stageId }) {
    const product = await Product.findById(productId);
    const { trelloAccessToken } = product;

    const tag = tagId ? await Tag.findById(tagId) : null;
    const stage = await RoadmapStage.findById(stageId);

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
    const [roadmapItem, created] = await RoadmapItem.findOrCreate({
      where: { productId, trelloRef },
      defaults: {
        title,
        description,
        stageId,
      },
    });
    if (tagIds) {
      await this.addTags(roadmapItem.id, tagIds);
    }

    if (created) {
      await trigger('roadmap_item_created', { roadmapItemId: roadmapItem.id });
    }

    if (!created) {
      await roadmapItem.update({ title, description, stageId });
    }
    return roadmapItem;
  },
});

module.exports = RoadmapItemService;
