module.exports = (sequelize, DataTypes) => {
  const FeedbackComment = sequelize.define(
    'feedback_comment',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      authorId: {
        type: DataTypes.UUID,
        field: 'author_id',
        allowNull: false,
      },
      feedbackId: {
        type: DataTypes.UUID,
        field: 'feedback_id',
        allowNull: false,
      },
      feedbackExternalRefId: {
        type: DataTypes.UUID,
        field: 'feedback_external_ref_id',
        allowNull: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachments: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
        defaultValue: [],
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
    },
    {},
  );

  /**
   * Associations
   */
  FeedbackComment.associate = models => {
    const { Feedback, User } = models;
    FeedbackComment.belongsTo(Feedback, {
      as: 'feedback',
      foreignKey: 'feedbackId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    FeedbackComment.belongsTo(User, {
      as: 'author',
      foreignKey: 'authorId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return FeedbackComment;
};
