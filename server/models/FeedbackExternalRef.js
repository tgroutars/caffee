module.exports = (sequelize, DataTypes) => {
  const FeedbackExternalRef = sequelize.define(
    'feedback_external_ref',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      feedbackId: {
        type: DataTypes.UUID,
        field: 'feedback_id',
        allowNull: false,
      },
      ref: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      props: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      indexes: [
        {
          fields: ['ref'],
          unique: true,
        },
      ],
    },
  );

  /**
   * Associations
   */
  FeedbackExternalRef.associate = models => {
    const { Feedback } = models;
    FeedbackExternalRef.belongsTo(Feedback, {
      as: 'feedback',
      foreignKey: 'feedbackId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return FeedbackExternalRef;
};
