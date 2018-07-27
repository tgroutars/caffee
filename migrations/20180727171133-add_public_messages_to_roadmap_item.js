module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('roadmap_item', 'public_messages', {
      type: Sequelize.ARRAY(Sequelize.JSONB),
      allowNull: false,
      defaultValue: [],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('roadmap_item', 'public_messages');
  },
};
