const { BacklogItem, Sequelize } = require('../../../../../models');

const { Op } = Sequelize;

const addFeedbackToBacklogItem = async payload => {
  const { value, name } = payload;
  const { productId } = name;

  const searchString = `%${value.replace('%', '\\%')}%`;

  const backlogItems = await BacklogItem.findAll({
    where: {
      productId,
      archivedAt: null,
      [Op.or]: {
        title: { [Op.iLike]: searchString },
        description: { [Op.iLike]: searchString },
      },
    },
  });

  return backlogItems.map(item => ({
    text: item.title,
    value: { backlogItemId: item.id },
  }));
};

module.exports = addFeedbackToBacklogItem;
