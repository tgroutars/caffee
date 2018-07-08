module.exports = (sequelize, DataTypes) => {
  const SlackWorkspace = sequelize.define(
    'slack_workspace',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
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
      domain: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accessToken: {
        type: DataTypes.STRING,
        field: 'access_token',
        allowNull: false,
      },
      appId: {
        type: DataTypes.STRING,
        field: 'app_id',
        allowNull: false,
      },
      appUserId: {
        type: DataTypes.STRING,
        field: 'app_user_id',
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          fields: ['slack_id'],
          unique: true,
        },
      ],
    },
  );

  /**
   * Associations
   */
  SlackWorkspace.associate = models => {
    const { SlackInstall, SlackUser, Product } = models;
    SlackWorkspace.hasMany(SlackInstall, {
      as: 'installs',
      foreignKey: 'workspaceId',
    });
    SlackWorkspace.hasMany(SlackUser, {
      as: 'slackUsers',
      foreignKey: 'workspaceId',
    });
    SlackWorkspace.belongsToMany(Product, {
      as: 'products',
      through: SlackInstall,
      foreignKey: 'workspaceId',
      otherKey: 'productId',
    });
  };
  return SlackWorkspace;
};
