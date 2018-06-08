module.exports = (sequelize, DataTypes) => {
  const SlackInstall = sequelize.define(
    'slack_install',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      workspaceId: {
        type: DataTypes.UUID,
        field: 'workspace_id',
        allowNull: false,
      },
      productId: {
        type: DataTypes.UUID,
        field: 'product_id',
        allowNull: false,
      },
      channel: { type: DataTypes.STRING },
    },
    {
      indexes: [
        {
          fields: ['product_id', 'workspace_id'],
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
  SlackInstall.associate = models => {
    const { SlackWorkspace, Product } = models;
    SlackInstall.belongsTo(SlackWorkspace, {
      as: 'workspace',
      foreignKey: 'workspace_id',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    SlackInstall.belongsTo(Product, {
      as: 'product',
      foreignKey: 'productId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return SlackInstall;
};
