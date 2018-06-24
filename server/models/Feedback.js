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
    createdById: {
      type: DataTypes.UUID,
      field: 'created_by_id',
      allowNull: false,
    },
    backlogItemId: {
      type: DataTypes.UUID,
      field: 'backlog_item_id',
      allowNull: true,
    },
    archivedAt: {
      type: DataTypes.DATE,
      field: 'archived_at',
      allowNull: true,
    },
    archiveReason: {
      type: DataTypes.TEXT,
      field: 'archive_reason',
      allowNull: true,
    },
  });

  /**
   * Associations
   */
  Feedback.associate = models => {
    const { Product, User, BacklogItem } = models;
    Feedback.belongsTo(User, {
      as: 'author',
      foreignKey: 'authorId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Feedback.belongsTo(User, {
      as: 'createdBy',
      foreignKey: 'createdById',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Feedback.belongsTo(Product, {
      as: 'product',
      foreignKey: 'productId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Feedback.belongsTo(BacklogItem, {
      as: 'backlogItem',
      foreignKey: 'backlogItemId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return Feedback;
};
