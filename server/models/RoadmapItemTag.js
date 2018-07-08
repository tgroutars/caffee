module.exports = (sequelize, DataTypes) => {
  const RoadmapItemTag = sequelize.define(
    'roadmap_item_tag',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      roadmapItemId: {
        type: DataTypes.UUID,
        field: 'roadmap_item_id',
        allowNull: false,
      },
      tagId: {
        type: DataTypes.UUID,
        field: 'tag_id',
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          fields: ['roadmap_item_id', 'tag_id'],
          unique: true,
        },
      ],
    },
  );

  /**
   * Associations
   */
  RoadmapItemTag.associate = models => {
    const { RoadmapItem, Tag } = models;
    RoadmapItemTag.belongsTo(RoadmapItem, {
      as: 'roadmapItem',
      foreignKey: 'roadmapItemId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    RoadmapItemTag.belongsTo(Tag, {
      as: 'tag',
      foreignKey: 'tagId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return RoadmapItemTag;
};
