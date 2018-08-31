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
    roadmapItemId: {
      type: DataTypes.UUID,
      field: 'roadmap_item_id',
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
    attachments: {
      type: DataTypes.ARRAY(DataTypes.JSONB),
      allowNull: false,
      defaultValue: [],
    },
    scopeId: {
      type: DataTypes.UUID,
      field: 'scope_id',
      allowNull: true,
    },
    assignedToId: {
      type: DataTypes.UUID,
      field: 'assigned_to_id',
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
  });

  /**
   * Associations
   */
  Feedback.associate = models => {
    const {
      Product,
      User,
      RoadmapItem,
      Scope,
      FeedbackExternalRef,
      FeedbackComment,
    } = models;
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
    Feedback.belongsTo(RoadmapItem, {
      as: 'roadmapItem',
      foreignKey: 'roadmapItemId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Feedback.belongsTo(Scope, {
      as: 'scope',
      foreignKey: 'scopeId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Feedback.belongsTo(User, {
      as: 'assignedTo',
      foreignKey: 'assignedToId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Feedback.hasMany(FeedbackExternalRef, {
      as: 'externalRefs',
      foreignKey: 'feedbackId',
    });
    Feedback.hasMany(FeedbackComment, {
      as: 'comments',
      foreignKey: 'feedbackId',
    });
  };

  return Feedback;
};
