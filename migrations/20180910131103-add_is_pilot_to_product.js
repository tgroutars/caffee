module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('product', 'is_pilot', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('product', 'is_pilot');
  },
};
