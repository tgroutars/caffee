module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex(
      'backlog_stage',
      ['trello_ref', 'product_id'],
      {
        indexName: 'backlog_stage_trello_ref_product_id_index',
        indicesType: 'UNIQUE',
        where: {
          deleted_at: null,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'backlog_stage',
      'backlog_stage_trello_ref_product_id_index',
    );
  },
};
