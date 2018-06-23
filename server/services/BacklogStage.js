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
});

module.exports = BacklogStageService;
