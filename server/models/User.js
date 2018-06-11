module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      image: {
        type: DataTypes.STRING,
      },
    },
    {
      indexes: [
        {
          name: 'user_email_index',
          fields: ['email'],
          unique: true,
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );

  /**
   * Associations
   */
  User.associate = models => {
    const { SlackUser } = models;
    User.hasMany(SlackUser, {
      as: 'slackUsers',
      foreignKey: 'userId',
    });
  };

  return User;
};
