module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex(
      'backlog_item_tag',
      ['backlog_item_id', 'tag_id'],
      {
        indexName: 'backlog_item_tag_backlog_item_id_tag_id_index',
        indicesType: 'UNIQUE',
        where: {
          deleted_at: null,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'backlog_item_tag',
      'backlog_item_tag_backlog_item_id_tag_id_index',
    );
  },
};
