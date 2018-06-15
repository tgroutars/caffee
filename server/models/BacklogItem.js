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
      trelloWebhookRef: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'trello_webhook_ref',
      },
    },
    {
      indexes: [
        {
          fields: ['trello_ref'],
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
    const { Product } = models;

    BacklogItem.belongsTo(Product, {
      as: 'product',
      foreignKey: 'productId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return BacklogItem;
};
