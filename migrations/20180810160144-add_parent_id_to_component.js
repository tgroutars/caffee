module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('scope', 'parent_id', {
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
    await queryInterface.removeColumn('scope', 'parent_id');
  },
};
