module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('slack_workspace', ['slack_id'], {
      indexName: 'slack_workspace_slack_id_index',
      indicesType: 'UNIQUE',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'slack_workspace',
      'slack_workspace_slack_id_index',
    );
  },
};
