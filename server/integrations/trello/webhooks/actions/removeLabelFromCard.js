const Promise = require('bluebird');

const { Tag, BacklogItem } = require('../../../../models');
const { BacklogItem: BacklogItemService } = require('../../../../services');

const removeLabelFromCard = async payload => {
  const { card, label } = payload.action.data;

  const backlogItems = await BacklogItem.findAll({
    where: { trelloRef: card.id },
  });
  const tag = await Tag.find({ where: { trelloRef: label.id } });
  await Promise.map(backlogItems, async backlogItem => {
    await BacklogItemService.removeTag(backlogItem.id, tag.id);
  });
};

module.exports = removeLabelFromCard;
