module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define('feedback', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      field: 'product_id',
      allowNull: false,
    },
    authorId: {
      type: DataTypes.UUID,
      field: 'author_id',
      allowNull: false,
    },
  });

  /**
   * Associations
   */
  Feedback.associate = models => {
    const { Product, User } = models;
    Feedback.belongsTo(User, {
      as: 'author',
      foreignKey: 'authorId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Feedback.belongsTo(Product, {
      as: 'product',
      foreignKey: 'productId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return Feedback;
};
