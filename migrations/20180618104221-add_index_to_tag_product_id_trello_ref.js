module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('tag', ['product_id', 'trello_ref'], {
      indexName: 'tag_product_id_trello_ref_index',
      indicesType: 'UNIQUE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('tag', 'tag_product_id_trello_ref_index');
  },
};
