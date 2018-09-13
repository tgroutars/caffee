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
        type: DataTypes.ENUM('external', 'author', 'user', 'admin'),
        allowNull: false,
        defaultValue: 'author',
      },
      isPM: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.role === 'admin' || this.role === 'user';
        },
      },
      isAdmin: {
        type: DataTypes.VIRTUAL,
        get() {
          return this.role === 'admin';
        },
      },
    },
    {
      indexes: [
        {
          fields: ['product_id', 'user_id'],
          unique: true,
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
