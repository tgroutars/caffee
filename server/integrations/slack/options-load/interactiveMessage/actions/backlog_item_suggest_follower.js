const {
  BacklogItem,
  User,
  ProductUser,
  Sequelize,
} = require('../../../../../models');

const { Op } = Sequelize;

const backlogItemSuggestFollower = async payload => {
  const { value, name } = payload;
  const { backlogItemId } = name;

  const searchString = `%${value.replace('%', '\\%')}%`;

  const backlogItem = await BacklogItem.findById(backlogItemId);
  if (!backlogItem) {
    return [];
  }
  const { productId } = backlogItem;

  const productUsers = await ProductUser.findAll({
    where: { productId },
    include: [
      {
        model: User,
        as: 'user',
        where: {
          name: { [Op.iLike]: searchString },
        },
      },
    ],
  });

  return productUsers.map(({ user }) => ({
    text: user.name,
    value: { userId: user.id },
  }));
};

module.exports = backlogItemSuggestFollower;
