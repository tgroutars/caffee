const Promise = require('bluebird');

const { Scope, Product, sequelize } = require('../models');

const ScopeService = (/* services */) => ({
  async create({ productId, name, parentId, responsibleId: responsibleIdArg }) {
    let level = 0;
    let responsibleId = responsibleIdArg;
    if (parentId) {
      const parent = await Scope.findById(parentId);
      level = parent.level + 1;
    }
    if (!responsibleId) {
      const product = await Product.findById(productId);
      responsibleId = product.ownerId;
    }
    return Scope.create({
      productId,
      name,
      parentId,
      responsibleId,
      level,
    });
  },

  async setName(scopeId, { name }) {
    await Scope.update({ name }, { where: { id: scopeId } });
  },

  async setResponsible(scopeId, responsibleId) {
    await Scope.update({ responsibleId }, { where: { id: scopeId } });
  },

  async archive(scopeId) {
    // TODO: Do this in transaction
    const children = await Scope.findAll({
      where: { parentId: scopeId, archivedAt: null },
    });
    await Promise.map(children, child => this.archive(child.id));
    await Scope.update(
      { archivedAt: sequelize.fn('NOW') },
      { where: { id: scopeId } },
    );
  },
});

module.exports = ScopeService;
