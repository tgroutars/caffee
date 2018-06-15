module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('feedback', 'backlog_item_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'backlog_item',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('feedback', 'backlog_item_id');
  },
};
