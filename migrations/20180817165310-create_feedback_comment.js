module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedback_comment', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
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
      text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      attachments: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: false,
        defaultValue: [],
      },
      feedback_external_ref_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'feedback_external_ref',
          key: 'id',
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
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
