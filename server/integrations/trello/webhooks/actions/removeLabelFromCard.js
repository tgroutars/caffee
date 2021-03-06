const Promise = require('bluebird');

const { Tag, RoadmapItem } = require('../../../../models');
const { RoadmapItem: RoadmapItemService } = require('../../../../services');

const removeLabelFromCard = async payload => {
  const { card, label } = payload.action.data;

  const roadmapItems = await RoadmapItem.findAll({
    where: { trelloRef: card.id },
  });
  const tag = await Tag.find({ where: { trelloRef: label.id } });
  await Promise.map(roadmapItems, async roadmapItem => {
    await RoadmapItemService.removeTag(roadmapItem.id, tag.id);
  });
};

module.exports = removeLabelFromCard;
