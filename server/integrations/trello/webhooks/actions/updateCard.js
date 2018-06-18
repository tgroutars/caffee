const { BacklogItem } = require('../../../../models');
const { trigger } = require('../../../../eventQueue/eventQueue');

const updateCard = async payload => {
  const { data } = payload.action;
  const { card, old } = data;

  // TODO: Create item in case the board is associated to a product
  // but the item does not exist
  const backlogItem = await BacklogItem.find({ where: { trelloRef: card.id } });
  if (!backlogItem) {
    return;
  }
  const newValues = {};

  if (old.idList && old.idList !== card.idList) {
    newValues.trelloListRef = card.idList;
    await trigger('backlog_item_moved', {
      backlogItemId: backlogItem.id,
      oldList: data.listBefore,
      newList: data.listAfter,
    });
  }

  if (old.desc && old.desc !== card.desc) {
    newValues.description = card.desc;
  }
  if (old.name && old.name !== card.name) {
    newValues.title = card.name;
  }

  if (Object.keys(newValues).length) {
    await backlogItem.update(newValues);
  }
};

module.exports = updateCard;
