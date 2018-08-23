module.exports = (sequelize, DataTypes) => {
  const SlackUser = sequelize.define(
    'slack_user',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
      },
      workspaceId: {
        type: DataTypes.UUID,
        field: 'workspace_id',
        allowNull: false,
      },
      slackId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'slack_id',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          fields: ['workspace_id', 'slack_id'],
          unique: true,
        },
      ],
    },
  );

  /**
   * Associations
   */
  SlackUser.associate = models => {
    const { SlackWorkspace, User } = models;
    SlackUser.belongsTo(SlackWorkspace, {
      as: 'workspace',
      foreignKey: 'workspaceId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    SlackUser.belongsTo(User, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return SlackUser;
};
