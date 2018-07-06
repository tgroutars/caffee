module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roadmap_item', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
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
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      trello_ref: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      trello_list_ref: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('roadmap_item');
  },
};
