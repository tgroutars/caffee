module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('feedback', 'roadmap_item_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'roadmap_item',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('feedback', 'roadmap_item_id');
  },
};
