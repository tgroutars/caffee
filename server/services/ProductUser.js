const { ProductUser } = require('../models');

module.exports = () => ({
  async setRole(productUserId, role) {
    await ProductUser.update({ role }, { where: { id: productUserId } });
  },
});
