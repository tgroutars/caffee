module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('user', ['email'], {
      indexName: 'user_email_index',
      indicesType: 'UNIQUE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('user', 'user_email_index');
  },
};
