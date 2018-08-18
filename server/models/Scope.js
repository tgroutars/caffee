module.exports = (sequelize, DataTypes) => {
  const Scope = sequelize.define('scope', {
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
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { max: 1 },
    },
    archivedAt: {
      type: DataTypes.DATE,
      field: 'archived_at',
    },
    isArchived: {
      type: DataTypes.VIRTUAL(DataTypes.BOOLEAN),
      get() {
        return !!this.archivedAt;
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
  });

  /**
   * Associations
   */
  Scope.associate = models => {
    const { Product, User } = models;
    Scope.belongsTo(Scope, {
      as: 'parent',
      foreignKey: 'parentId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Scope.hasMany(Scope, {
      as: 'children',
      foreignKey: 'parentId',
    });
    Scope.belongsTo(User, {
      as: 'responsible',
      foreignKey: 'responsibleId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Scope.belongsTo(Product, {
      as: 'product',
      foreignKey: 'productId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return Scope;
};
