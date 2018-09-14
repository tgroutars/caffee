module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('activity', {
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
      roadmap_item_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'roadmap_item',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      type: {
        type: Sequelize.ENUM('created', 'moved', 'archived'),
        allowNull: false,
      },
      activity: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      sent_at: {
        type: Sequelize.DATE,
      },
      discarded_at: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('activity');
  },
};
