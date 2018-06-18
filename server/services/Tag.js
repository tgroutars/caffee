const { Tag } = require('../models');

const TagService = (/* services */) => ({
  async destroyByTrelloRef(trelloRef) {
    Tag.destroy({ where: { trelloRef } });
  },
});

module.exports = TagService;
