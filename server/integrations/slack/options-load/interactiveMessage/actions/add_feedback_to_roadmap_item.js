const { RoadmapItem, Sequelize } = require('../../../../../models');

const { Op } = Sequelize;

const addFeedbackToRoadmapItem = async payload => {
  const { value, name } = payload;
  const { productId } = name;

  const searchString = `%${value.replace('%', '\\%')}%`;

  const roadmapItems = await RoadmapItem.findAll({
    where: {
      productId,
      archivedAt: null,
      [Op.or]: {
        title: { [Op.iLike]: searchString },
        description: { [Op.iLike]: searchString },
      },
    },
  });

  return roadmapItems.map(item => ({
    text: item.title,
    value: { roadmapItemId: item.id },
  }));
};

module.exports = addFeedbackToRoadmapItem;
