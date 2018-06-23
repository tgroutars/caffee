module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'product',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      ownerId: {
        type: DataTypes.UUID,
        field: 'owner_id',
      },
      trelloBoardId: {
        type: DataTypes.STRING,
        field: 'trello_board_id',
      },
      trelloAccessToken: {
        type: DataTypes.STRING,
        field: 'trello_access_token',
      },
      trelloAccessTokenSecret: {
        type: DataTypes.STRING,
        field: 'trello_access_token_secret',
      },
    },
    {},
  );

  /**
   * Associations
   */
  Product.associate = models => {
    const { User, ProductUser, BacklogItem, Tag, BacklogStage } = models;

    Product.belongsTo(User, {
      as: 'owner',
      onDelete: 'restrict',
      onUpdate: 'restrict',
      foreignKey: 'ownerId',
    });
    Product.belongsToMany(User, {
      as: 'users',
      through: ProductUser,
      foreignKey: 'productId',
      otherKey: 'userId',
    });
    Product.hasMany(BacklogItem, {
      as: 'backlogItems',
      foreignKey: 'productId',
    });
    Product.hasMany(Tag, {
      as: 'tags',
      foreignKey: 'productId',
    });
    Product.hasMany(BacklogStage, {
      as: 'backlogStages',
      foreignKey: 'productId',
    });
  };

  return Product;
};
