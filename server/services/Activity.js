const pick = require('lodash/pick');

const { Activity, RoadmapItem } = require('../models');

const RoadmapItemService = (/* services */) => ({
  async createArchived(roadmapItemId) {
    const roadmapItem = await RoadmapItem.findById(roadmapItemId);
    const activity = await Activity.create({
      productId: roadmapItem.productId,
      roadmapItemId: roadmapItem.id,
      type: 'archived',
    });
    return activity;
  },

  async createUnarchived(roadmapItemId) {
    const roadmapItem = await RoadmapItem.findById(roadmapItemId);
    const activity = await Activity.create({
      productId: roadmapItem.productId,
      roadmapItemId: roadmapItem.id,
      type: 'unarchived',
    });
    return activity;
  },

  async createMoved(roadmapItemId, { oldStage, newStage }) {
    const roadmapItem = await RoadmapItem.findById(roadmapItemId);
    const activity = await Activity.create({
      productId: roadmapItem.productId,
      roadmapItemId: roadmapItem.id,
      type: 'moved',
      activity: {
        oldStage: pick(oldStage, ['id', 'name']),
        newStage: pick(newStage, ['id', 'name']),
      },
    });
    return activity;
  },

  async createCreated(roadmapItemId) {
    const roadmapItem = await RoadmapItem.findById(roadmapItemId);
    const activity = await Activity.create({
      productId: roadmapItem.productId,
      roadmapItemId: roadmapItem.id,
      type: 'created',
    });
    return activity;
  },
});

module.exports = RoadmapItemService;
