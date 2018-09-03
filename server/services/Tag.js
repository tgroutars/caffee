const pick = require('lodash/pick');

const { Tag } = require('../models');

const TagService = (/* services */) => ({
  async updateByTrelloRef(trelloRef, values) {
    const newValues = pick(values, ['name']);
    await Tag.update(newValues, { where: { trelloRef } });
  },

  async destroyByTrelloRef(trelloRef) {
    Tag.destroy({ where: { trelloRef } });
  },

  async findOrCreate({ name, trelloRef, productId }) {
    return Tag.findOrCreate({
      where: { productId, trelloRef },
      defaults: { name },
    });
  },
});

module.exports = TagService;
