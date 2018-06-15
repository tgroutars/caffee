module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('backlog_item', 'trello_webhook_ref', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('backlog_item', 'trello_webhook_ref');
  },
};
