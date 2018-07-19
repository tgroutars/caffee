module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('product', 'onboarding_step', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('product', 'onboarding_step');
  },
};
