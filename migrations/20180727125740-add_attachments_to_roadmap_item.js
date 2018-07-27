module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('roadmap_item', 'attachments', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('roadmap_item', 'attachments');
  },
};
