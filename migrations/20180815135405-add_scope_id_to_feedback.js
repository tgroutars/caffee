module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('feedback', 'scope_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'scope',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('feedback', 'scope_id');
  },
};
