module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex(
      'roadmap_item_follow',
      ['roadmap_item_id', 'user_id'],
      {
        indexName: 'roadmap_item_follow_roadmap_item_id_user_id_index',
        indicesType: 'UNIQUE',
        where: {
          deleted_at: null,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'roadmap_item_follow',
      'roadmap_item_follow_roadmap_item_id_user_id_index',
    );
  },
};
