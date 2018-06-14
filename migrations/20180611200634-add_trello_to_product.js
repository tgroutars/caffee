module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('product', 'trello_access_token', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('product', 'trello_access_token_secret', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('product', 'trello_board_id', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('product', 'trello_board_id');
    await queryInterface.removeColumn('product', 'trello_access_token_secret');
    await queryInterface.removeColumn('product', 'trello_access_token');
  },
};
