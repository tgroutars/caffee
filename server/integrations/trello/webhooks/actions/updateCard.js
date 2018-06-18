const Promise = require('bluebird');

const { BacklogItem } = require('../../../../models');
const { trigger } = require('../../../../eventQueue/eventQueue');

const updateCard = async payload => {
  const { data } = payload.action;
  const { card, old } = data;

  // TODO: Create item in case the board is associated to a product
  // but the item does not exist
  const backlogItems = await BacklogItem.findAll({
    where: { trelloRef: card.id },
  });
  await Promise.map(backlogItems, async backlogItem => {
    if (card.closed) {
      await backlogItem.destroy();
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

    if (typeof old.desc !== 'undefined' && old.desc !== card.desc) {
      newValues.description = card.desc;
    }
    if (typeof old.name !== 'undefined' && old.name !== card.name) {
      newValues.title = card.name;
    }
    if (Object.keys(newValues).length) {
      await backlogItem.update(newValues);
    }
  });
};

module.exports = updateCard;
