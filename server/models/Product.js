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
    },
    {},
  );

  /**
   * Associations
   */
  Product.associate = models => {
    const { User, ProductUser } = models;

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
  };

  return Product;
};
