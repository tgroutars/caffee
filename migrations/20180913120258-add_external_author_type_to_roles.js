const replaceEnum = require('./utils/replaceEnum');

module.exports = {
  up(queryInterface) {
    return replaceEnum({
      queryInterface,
      tableName: 'product_user',
      columnName: 'role',
      defaultValue: 'author',
      newValues: ['external', 'author', 'user', 'admin'],
    });
  },

  down(queryInterface) {
    return replaceEnum({
      queryInterface,
      tableName: 'product_user',
      columnName: 'role',
      defaultValue: 'author',
      newValues: ['author', 'user', 'admin'],
    });
  },
};
