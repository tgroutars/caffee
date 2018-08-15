module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('scope', 'archived_at', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('scope', 'archived_at');
  },
};
