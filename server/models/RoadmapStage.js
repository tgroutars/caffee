module.exports = (sequelize, DataTypes) => {
  const RoadmapStage = sequelize.define(
    'roadmap_stage',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.INTEGER,
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
      isArchived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'is_archived',
        defaultValue: false,
      },
    },
    {
      defaultScope: {
        order: [['position', 'ASC']],
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
  RoadmapStage.associate = models => {
    const { Product } = models;

    RoadmapStage.belongsTo(Product, {
      as: 'product',
      foreignKey: 'productId',
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  };

  return RoadmapStage;
};
