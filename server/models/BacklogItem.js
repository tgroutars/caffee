module.exports = (sequelize, DataTypes) => {
  const BacklogItem = sequelize.define(
    'backlog_item',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
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
    },
    {
      indexes: [
        {
          fields: ['trello_ref', 'product_id'],
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
  BacklogItem.associate = models => {
    const {
      Product,
      BacklogItemTag,
      Tag,
      User,
      BacklogItemFollow,
      BacklogStage,
    } = models;

    BacklogItem.belongsTo(Product, {
      as: 'product',
      foreignKey: 'productId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    BacklogItem.belongsToMany(Tag, {
      as: 'tags',
      through: BacklogItemTag,
      foreignKey: 'backlogItemId',
      otherKey: 'tagId',
    });
    BacklogItem.belongsToMany(User, {
      as: 'followers',
      through: BacklogItemFollow,
      foreignKey: 'backlogItemId',
      otherKey: 'userId',
    });
    BacklogItem.belongsTo(BacklogStage, {
      as: 'stage',
      foreignKey: 'stageId',
      onDelete: 'restrict',
      onUpdate: 'cascade',
    });
  };

  return BacklogItem;
};
