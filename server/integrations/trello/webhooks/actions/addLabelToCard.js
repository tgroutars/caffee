const Promise = require('bluebird');

const { RoadmapItem } = require('../../../../models');
const {
  RoadmapItem: RoadmapItemService,
  Tag: TagService,
} = require('../../../../services');

const addLabelToCard = async payload => {
  const { card, label } = payload.action.data;

  const roadmapItems = await RoadmapItem.findAll({
    where: { trelloRef: card.id },
  });
  await Promise.map(roadmapItems, async roadmapItem => {
    const [tag] = await TagService.findOrCreate({
      trelloRef: label.id,
      name: label.name || label.color,
      productId: roadmapItem.productId,
    });
    await RoadmapItemService.addTags(roadmapItem.id, [tag.id]);
  });
};

module.exports = addLabelToCard;
