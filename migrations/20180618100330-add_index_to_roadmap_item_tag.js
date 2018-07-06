module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex(
      'roadmap_item_tag',
      ['roadmap_item_id', 'tag_id'],
      {
        indexName: 'roadmap_item_tag_roadmap_item_id_tag_id_index',
        indicesType: 'UNIQUE',
        where: {
          deleted_at: null,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'roadmap_item_tag',
      'roadmap_item_tag_roadmap_item_id_tag_id_index',
    );
  },
};
