module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('roadmap_item', 'title', {
      type: Sequelize.STRING(4095),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('roadmap_item', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
