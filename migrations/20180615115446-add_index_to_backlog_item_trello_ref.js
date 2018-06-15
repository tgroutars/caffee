module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('backlog_item', ['trello_ref'], {
      indexName: 'backlog_item_trello_ref_index',
      indicesType: 'UNIQUE',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'backlog_item',
      'backlog_item_trello_ref_index',
    );
  },
};
