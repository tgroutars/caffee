module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedback_external_ref', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      feedback_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'feedback',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      ref: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      props: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {},
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('feedback_external_ref');
  },
};
