module.exports = (sequelize, DataTypes) => {
  const ProductUser = sequelize.define(
    'product_user',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      productId: {
        type: DataTypes.UUID,
        field: 'product_id',
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        field: 'user_id',
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('author', 'user', 'admin'),
        allowNull: false,
        defaultValue: 'author',
      },
    },
    {
      indexes: [
        {
          fields: ['product_id', 'user_id'],
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
  ProductUser.associate = models => {
    const { User, Product } = models;
    ProductUser.belongsTo(Product, {
      as: 'product',
      foreignKey: 'productId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    ProductUser.belongsTo(User, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return ProductUser;
};
