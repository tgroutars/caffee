module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('product', 'onboarding_step', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.sequelize.query(
      `UPDATE product SET onboarding_step = '01_choose_product_name';`,
    );
    await queryInterface.changeColumn('product', 'onboarding_step', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('product', 'onboarding_step');
  },
};
