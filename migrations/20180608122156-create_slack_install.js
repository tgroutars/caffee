module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('slack_install', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      workspace_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'slack_workspace',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'product',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      channel: { type: Sequelize.STRING },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('slack_install');
  },
};
