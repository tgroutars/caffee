const {
  RoadmapItem,
  User,
  ProductUser,
  Sequelize,
} = require('../../../../../models');

const { Op } = Sequelize;

const roadmapItemSuggestFollower = async payload => {
  const { value, name } = payload;
  const { roadmapItemId } = name;

  const searchString = `%${value.replace('%', '\\%')}%`;

  const roadmapItem = await RoadmapItem.findById(roadmapItemId);
  if (!roadmapItem) {
    return [];
  }
  const { productId } = roadmapItem;

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

module.exports = roadmapItemSuggestFollower;
