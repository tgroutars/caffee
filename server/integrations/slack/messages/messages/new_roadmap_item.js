const getRoadmapItemAttachment = require('../attachments/roadmap_item');

const newRoadmapItem = ({
  roadmapItem,
  product,
  openCard,
  stage,
  isPM,
  trelloCardURL,
  follow = true,
}) => {
  const attachments = [
    getRoadmapItemAttachment({
      roadmapItem,
      openCard,
      follow,
      stage,
      isPM,
      trelloCardURL,
    }),
  ];
  return {
    attachments,
    text: `*_New roadmap item for ${product.name}_*`,
  };
};

module.exports = newRoadmapItem;
