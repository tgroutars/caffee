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
      trelloListRef: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'trello_list_ref',
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
    const { Product, BacklogItemTag, Tag } = models;

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
  };

  return BacklogItem;
};
