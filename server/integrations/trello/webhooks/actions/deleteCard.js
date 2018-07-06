const { RoadmapItem } = require('../../../../models');

const deleteCard = async payload => {
  const { card } = payload.action.data;
  await RoadmapItem.destroy({ where: { trelloRef: card.id } });
};

module.exports = deleteCard;
