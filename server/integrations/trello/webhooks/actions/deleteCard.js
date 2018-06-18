const { BacklogItem } = require('../../../../models');

const deleteCard = async payload => {
  const { card } = payload.action.data;
  await BacklogItem.destroy({ where: { trelloRef: card.id } });
};

module.exports = deleteCard;
