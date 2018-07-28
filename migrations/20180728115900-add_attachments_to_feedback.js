module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('feedback', 'attachments', {
      type: Sequelize.ARRAY(Sequelize.JSONB),
      allowNull: false,
      defaultValue: [],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('feedback', 'attachments');
  },
};
