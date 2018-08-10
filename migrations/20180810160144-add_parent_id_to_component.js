module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('component', 'parent_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'component',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('component', 'parent_id');
  },
};
