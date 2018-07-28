module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('roadmap_stage', 'is_archived', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('roadmap_stage', 'is_archived');
  },
};
