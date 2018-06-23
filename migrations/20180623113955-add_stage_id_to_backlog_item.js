module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('backlog_item', 'trello_list_ref');
    await queryInterface.addColumn('backlog_item', 'stage_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'backlog_stage',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('backlog_item', 'stage_id');
    await queryInterface.addColumn('backlog_item', 'trello_ref', {
      type: Sequelize.STRING,
    });
  },
};
