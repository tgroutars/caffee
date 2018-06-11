module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('product_user', ['product_id', 'user_id'], {
      indexName: 'product_user_product_id_user_id_index',
      indicesType: 'UNIQUE',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'product_user',
      'product_user_product_id_user_id_index',
    );
  },
};
