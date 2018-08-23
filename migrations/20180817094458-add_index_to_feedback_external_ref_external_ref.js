module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('feedback_external_ref', ['ref'], {
      indexName: 'feedback_external_ref_ref_index',
      indicesType: 'UNIQUE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'feedback_external_ref',
      'feedback_external_ref_ref_index',
    );
  },
};
