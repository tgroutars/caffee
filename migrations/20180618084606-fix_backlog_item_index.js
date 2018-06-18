module.exports = {
  async up(queryInterface) {
    await queryInterface.removeIndex(
      'backlog_item',
      'backlog_item_trello_ref_index',
    );
    await queryInterface.addIndex(
      'backlog_item',
      ['trello_ref', 'product_id'],
      {
        indexName: 'backlog_item_trello_ref_product_id_index',
        indicesType: 'UNIQUE',
        where: {
          deleted_at: null,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.addIndex('backlog_item', ['trello_ref'], {
      indexName: 'backlog_item_trello_ref_index',
      indicesType: 'UNIQUE',
      where: {
        deleted_at: null,
      },
    });
    await queryInterface.removeIndex(
      'backlog_item',
      'backlog_item_trello_ref_product_id_index',
    );
  },
};
