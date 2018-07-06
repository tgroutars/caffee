module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex(
      'roadmap_stage',
      ['trello_ref', 'product_id'],
      {
        indexName: 'roadmap_stage_trello_ref_product_id_index',
        indicesType: 'UNIQUE',
        where: {
          deleted_at: null,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'roadmap_stage',
      'roadmap_stage_trello_ref_product_id_index',
    );
  },
};
