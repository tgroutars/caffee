module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'tag',
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
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'product_id',
      },
      trelloRef: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'trello_ref',
      },
    },
    {
      indexes: [
        {
          fields: ['product_id', 'trello_ref'],
          unique: true,
          where: {
            deleted_at: null,
          },
        },
      ],
    },
  );

  return Tag;
};
