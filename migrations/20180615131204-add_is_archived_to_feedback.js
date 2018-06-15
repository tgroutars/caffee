module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('feedback', 'archived_at', {
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn('feedback', 'archive_reason', {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('feedback', 'archive_reason');
    await queryInterface.removeColumn('feedback', 'archived_at');
  },
};
