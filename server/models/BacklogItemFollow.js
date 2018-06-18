module.exports = (sequelize, DataTypes) => {
  const BacklogItemFollow = sequelize.define(
    'backlog_item_follow',
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
      userId: {
        type: DataTypes.UUID,
        field: 'user_id',
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          fields: ['backlog_item_id', 'user_id'],
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
  BacklogItemFollow.associate = models => {
    const { BacklogItem, User } = models;
    BacklogItemFollow.belongsTo(BacklogItem, {
      as: 'backlogItem',
      foreignKey: 'backlogItemId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    BacklogItemFollow.belongsTo(User, {
      as: 'user',
      foreignKey: 'userId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return BacklogItemFollow;
};
