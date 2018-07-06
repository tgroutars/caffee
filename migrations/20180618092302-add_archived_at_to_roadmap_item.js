module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('roadmap_item', 'archived_at', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('roadmap_item', 'archived_at');
  },
};
