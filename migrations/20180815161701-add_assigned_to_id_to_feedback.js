module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('feedback', 'assigned_to_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('feedback', 'assigned_to_id');
  },
};
