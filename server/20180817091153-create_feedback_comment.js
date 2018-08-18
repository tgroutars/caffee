module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedback_comment', {
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
      author_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      attachments: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: false,
        defaultValue: [],
      },
      external_ref: {
        type: Sequelize.JSONB,
        allowNull: false,
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
    await queryInterface.dropTable('feedback_comment');
  },
};
