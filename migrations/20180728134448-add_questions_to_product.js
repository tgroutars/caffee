module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('product', 'questions', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
      defaultValue: [],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('product', 'questions');
  },
};
