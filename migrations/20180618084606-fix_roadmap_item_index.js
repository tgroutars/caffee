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
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.addIndex('roadmap_item', ['trello_ref'], {
      indexName: 'roadmap_item_trello_ref_index',
      indicesType: 'UNIQUE',
    });
    await queryInterface.removeIndex(
      'roadmap_item',
      'roadmap_item_trello_ref_product_id_index',
    );
  },
};
