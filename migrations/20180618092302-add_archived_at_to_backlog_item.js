module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('backlog_item', 'archived_at', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('backlog_item', 'archived_at');
  },
};
