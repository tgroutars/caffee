module.exports = (sequelize, DataTypes) => {
  const Component = sequelize.define('component', {
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
    productId: {
      type: DataTypes.UUID,
      field: 'product_id',
      allowNull: false,
    },
    responsibleId: {
      type: DataTypes.UUID,
      field: 'responsible_id',
      allowNull: false,
    },
    parentId: {
      type: DataTypes.UUID,
      field: 'parent_id',
      allowNull: true,
    },
  });

  /**
   * Associations
   */
  Component.associate = models => {
    const { Product, User } = models;
    Component.belongsTo(Component, {
      as: 'parent',
      foreignKey: 'parentId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Component.belongsTo(User, {
      as: 'responsible',
      foreignKey: 'responsibleId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Component.belongsTo(Product, {
      as: 'product',
      foreignKey: 'productId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return Component;
};
