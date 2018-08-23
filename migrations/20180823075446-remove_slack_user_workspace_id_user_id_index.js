module.exports = {
  async up(queryInterface) {
    await queryInterface.removeIndex(
      'slack_user',
      'slack_user_workspace_id_user_id_index',
    );
  },

  async down(queryInterface) {
    await queryInterface.addIndex('slack_user', ['workspace_id', 'user_id'], {
      indexName: 'slack_user_workspace_id_user_id_index',
      indicesType: 'UNIQUE',
    });
  },
};
