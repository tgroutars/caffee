module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('slack_user', ['workspace_id', 'slack_id'], {
      indexName: 'slack_user_workspace_id_slack_id_index',
      indicesType: 'UNIQUE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'slack_user',
      'slack_user_workspace_id_slack_id_index',
    );
  },
};
