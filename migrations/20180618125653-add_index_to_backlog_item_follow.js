module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex(
      'backlog_item_follow',
      ['backlog_item_id', 'user_id'],
      {
        indexName: 'backlog_item_follow_backlog_item_id_user_id_index',
        indicesType: 'UNIQUE',
        where: {
          deleted_at: null,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'backlog_item_follow',
      'backlog_item_follow_backlog_item_id_user_id_index',
    );
  },
};
