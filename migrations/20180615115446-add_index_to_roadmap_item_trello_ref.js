module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('roadmap_item', ['trello_ref'], {
      indexName: 'roadmap_item_trello_ref_index',
      indicesType: 'UNIQUE',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'roadmap_item',
      'roadmap_item_trello_ref_index',
    );
  },
};
