module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('activity', {
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
    roadmapItemId: {
      type: DataTypes.UUID,
      field: 'roadmap_item_id',
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('created', 'moved', 'archived', 'unarchived'),
      allowNull: false,
    },
    activity: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {},
    },
    sentAt: {
      type: DataTypes.DATE,
      field: 'sent_at',
    },
    discardedAt: {
      type: DataTypes.DATE,
      field: 'discarded_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  });

  /**
   * Associations
   */
  Activity.associate = models => {
    const { RoadmapItem, Product } = models;
    Activity.belongsTo(RoadmapItem, {
      as: 'roadmapItem',
      foreignKey: 'roadmapItemId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    Activity.belongsTo(Product, {
      as: 'product',
      foreignKey: 'productId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return Activity;
};
