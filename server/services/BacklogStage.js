const pick = require('lodash/pick');

const { BacklogStage } = require('../models');

const BacklogStageService = (/* services */) => ({
  async create({ productId, position, name, trelloRef }) {
    const stage = await BacklogStage.create({
      productId,
      position,
      name,
      trelloRef,
    });

    return stage;
  },

  async destroy({ where }) {
    return BacklogStage.destroy({ where });
  },

  async update(values, { where }) {
    const newValues = pick(values, ['name', 'position']);
    return BacklogStage.update(newValues, { where });
  },
});

module.exports = BacklogStageService;
