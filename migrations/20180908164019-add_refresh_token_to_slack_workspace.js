module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('slack_workspace', 'refresh_token', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('slack_workspace', 'token_expires_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('slack_workspace', 'token_expires_at');
    await queryInterface.removeColumn('slack_workspace', 'refresh_token');
  },
};
