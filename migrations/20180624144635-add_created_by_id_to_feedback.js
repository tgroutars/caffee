module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('feedback', 'created_by_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'user',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
    await queryInterface.sequelize.query(`
      UPDATE feedback set created_by_id = feedback.author_id;
    `);
    await queryInterface.changeColumn('feedback', 'created_by_id', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('feedback', 'created_by_id');
  },
};
