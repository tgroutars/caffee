module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('component', {
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
      responsible_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('component');
  },
};
