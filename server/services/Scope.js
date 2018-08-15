const { Scope, Product } = require('../models');

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
    const scope = await Scope.findById(scopeId);
    await scope.update({ name });
    return scope;
  },
});

module.exports = ScopeService;
