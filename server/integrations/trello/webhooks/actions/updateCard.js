const Promise = require('bluebird');

const { BacklogItem: BacklogItemService } = require('../../../../services');
const { BacklogItem } = require('../../../../models');

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
      await BacklogItemService.archive(backlogItem.id);
      return;
    }
    if (old.closed && !card.closed) {
      await BacklogItemService.unarchive(backlogItem.id);
    }

    if (old.idList && old.idList !== card.idList) {
      await BacklogItemService.move(backlogItem.id, {
        oldList: data.listBefore,
        newList: data.listAfter,
      });
    }

    const newValues = {};
    if (typeof old.desc !== 'undefined' && old.desc !== card.desc) {
      newValues.description = card.desc;
    }
    if (typeof old.name !== 'undefined' && old.name !== card.name) {
      newValues.title = card.name;
    }
    if (Object.keys(newValues).length) {
      await BacklogItemService.update(backlogItem.id, newValues);
    }
  });
};

module.exports = updateCard;
