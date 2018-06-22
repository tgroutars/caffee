const { BacklogItem, Sequelize } = require('../../../../../models');

const { Op } = Sequelize;

const addFeedbackToBacklogItem = async payload => {
  const { value, name } = payload;
  const { productId } = name;

  const backlogItems = await BacklogItem.findAll({
    where: {
      productId,
      [Op.or]: { title: { [Op.iLike]: `%${value.replace('%', '\\%')}%` } },
    },
  });

  return backlogItems.map(item => ({
    text: item.title,
    value: { backlogItemId: item.id },
  }));
};

module.exports = addFeedbackToBacklogItem;
