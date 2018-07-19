const Promise = require('bluebird');

const { RoadmapItem: RoadmapItemService } = require('../../../../services');
const { RoadmapItem } = require('../../../../models');

const updateCard = async payload => {
  const { data } = payload.action;
  const { card, old } = data;

  // TODO: Create item in case the board is associated to a product
  // but the item does not exist
  const roadmapItems = await RoadmapItem.unscoped().findAll({
    where: { trelloRef: card.id },
  });
  await Promise.map(roadmapItems, async roadmapItem => {
    if (card.closed) {
      await RoadmapItemService.archive(roadmapItem.id);
      return;
    }
    if (old.closed && !card.closed) {
      await RoadmapItemService.unarchive(roadmapItem.id);
    }

    if (old.idList && old.idList !== card.idList) {
      await RoadmapItemService.move(roadmapItem.id, {
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
      await RoadmapItemService.update(roadmapItem.id, newValues);
    }
  });
};

module.exports = updateCard;
