module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('slack_workspace', ['slack_id'], {
      indexName: 'slack_workspace_slack_id_index',
      indicesType: 'UNIQUE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'slack_workspace',
      'slack_workspace_slack_id_index',
    );
  },
};
