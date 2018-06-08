module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('user', ['email'], {
      indexName: 'user_email_index',
      indicesType: 'UNIQUE',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('user', 'user_email_index');
  },
};
