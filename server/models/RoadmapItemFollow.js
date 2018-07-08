module.exports = (sequelize, DataTypes) => {
  const RoadmapItemFollow = sequelize.define(
    'roadmap_item_follow',
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
      userId: {
        type: DataTypes.UUID,
        field: 'user_id',
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          fields: ['roadmap_item_id', 'user_id'],
          unique: true,
        },
      ],
    },
  );

  /**
   * Associations
   */
  RoadmapItemFollow.associate = models => {
    const { RoadmapItem, User } = models;
    RoadmapItemFollow.belongsTo(RoadmapItem, {
      as: 'roadmapItem',
      foreignKey: 'roadmapItemId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    RoadmapItemFollow.belongsTo(User, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return RoadmapItemFollow;
};
