const pick = require('lodash/pick');

const { RoadmapStage } = require('../models');

const RoadmapStageService = (/* services */) => ({
  async create({ productId, position, name, trelloRef }) {
    const stage = await RoadmapStage.create({
      productId,
      position,
      name,
      trelloRef,
    });

    return stage;
  },

  async destroy({ where }) {
    return RoadmapStage.destroy({ where });
  },

  async update(values, { where }) {
    const newValues = pick(values, ['name', 'position']);
    return RoadmapStage.update(newValues, { where });
  },
});

module.exports = RoadmapStageService;
