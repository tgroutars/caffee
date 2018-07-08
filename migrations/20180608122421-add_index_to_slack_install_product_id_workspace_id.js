module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex(
      'slack_install',
      ['product_id', 'workspace_id'],
      {
        indexName: 'slack_install_product_id_workspace_id_index',
        indicesType: 'UNIQUE',
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'slack_install',
      'slack_install_product_id_workspace_id_index',
    );
  },
};
