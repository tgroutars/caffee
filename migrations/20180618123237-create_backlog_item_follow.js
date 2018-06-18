module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('backlog_item_follow', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      backlog_item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'backlog_item',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('backlog_item_follow');
  },
};
