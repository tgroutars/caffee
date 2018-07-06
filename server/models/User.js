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
    const {
      SlackUser,
      Product,
      ProductUser,
      RoadmapItemFollow,
      RoadmapItem,
    } = models;
    User.hasMany(SlackUser, {
      as: 'slackUsers',
      foreignKey: 'userId',
    });
    User.belongsToMany(Product, {
      as: 'products',
      through: ProductUser,
      foreignKey: 'userId',
      otherKey: 'productId',
    });
    User.hasMany(RoadmapItemFollow, {
      as: 'follows',
      foreignKey: 'userId',
    });
    User.belongsToMany(RoadmapItem, {
      as: 'followedRoadmapItems',
      through: RoadmapItemFollow,
      foreignKey: 'userId',
      otherKey: 'roadmapItemId',
    });
  };

  return User;
};
