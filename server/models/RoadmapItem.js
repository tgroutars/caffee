module.exports = (sequelize, DataTypes) => {
  const RoadmapItem = sequelize.define(
    'roadmap_item',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING(4095),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      productId: {
        type: DataTypes.UUID,
        field: 'product_id',
        allowNull: false,
      },
      trelloRef: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'trello_ref',
      },
      stageId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'stage_id',
      },
      archivedAt: {
        type: DataTypes.DATE,
        field: 'archived_at',
      },
      trelloCardURL: {
        type: DataTypes.VIRTUAL,
        get() {
          return `https://trello.com/c/${this.trelloRef}`;
        },
      },
      followerCount: {
        type: DataTypes.INTEGER,
        field: 'follower_count',
        defaultValue: 0,
      },
      attachments: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
        defaultValue: [],
      },
      publicMessages: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        field: 'public_messages',
        allowNull: false,
        defaultValue: [],
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
      },
    },
    {
      // TODO: remove default scope and filter
      // appropriately in different parts of the app
      defaultScope: {
        where: { archivedAt: null },
      },
      indexes: [
        {
          fields: ['trello_ref', 'product_id'],
          unique: true,
        },
      ],
    },
  );

  /**
   * Associations
   */
  RoadmapItem.associate = models => {
    const {
      Product,
      RoadmapItemTag,
      Tag,
      User,
      RoadmapItemFollow,
      RoadmapStage,
    } = models;

    RoadmapItem.belongsTo(Product, {
      as: 'product',
      foreignKey: 'productId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    RoadmapItem.belongsToMany(Tag, {
      as: 'tags',
      through: RoadmapItemTag,
      foreignKey: 'roadmapItemId',
      otherKey: 'tagId',
    });
    RoadmapItem.belongsToMany(User, {
      as: 'followers',
      through: RoadmapItemFollow,
      foreignKey: 'roadmapItemId',
      otherKey: 'userId',
    });
    RoadmapItem.belongsTo(RoadmapStage, {
      as: 'stage',
      foreignKey: 'stageId',
      onDelete: 'restrict',
      onUpdate: 'cascade',
    });
  };

  return RoadmapItem;
};
