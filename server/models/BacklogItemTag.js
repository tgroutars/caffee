module.exports = (sequelize, DataTypes) => {
  const BacklogItemTag = sequelize.define(
    'backlog_item_tag',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      backlogItemId: {
        type: DataTypes.UUID,
        field: 'backlog_item_id',
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
          fields: ['backlog_item_id', 'tag_id'],
          unique: true,
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );

  /**
   * Associations
   */
  BacklogItemTag.associate = models => {
    const { BacklogItem, Tag } = models;
    BacklogItemTag.belongsTo(BacklogItem, {
      as: 'backlogItem',
      foreignKey: 'backlogItemId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    BacklogItemTag.belongsTo(Tag, {
      as: 'tag',
      foreignKey: 'tagId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return BacklogItemTag;
};
