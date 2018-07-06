module.exports = {
  async up(queryInterface) {
    await queryInterface.removeIndex(
      'roadmap_item',
      'roadmap_item_trello_ref_index',
    );
    await queryInterface.addIndex(
      'roadmap_item',
      ['trello_ref', 'product_id'],
      {
        indexName: 'roadmap_item_trello_ref_product_id_index',
        indicesType: 'UNIQUE',
        where: {
          deleted_at: null,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.addIndex('roadmap_item', ['trello_ref'], {
      indexName: 'roadmap_item_trello_ref_index',
      indicesType: 'UNIQUE',
      where: {
        deleted_at: null,
      },
    });
    await queryInterface.removeIndex(
      'roadmap_item',
      'roadmap_item_trello_ref_product_id_index',
    );
  },
};
