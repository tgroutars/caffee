const getRoadmapItemAttachment = require('../attachments/roadmap_item');

const roadmapItemMoved = ({
  roadmapItem,
  oldStage,
  newStage,
  isFollowing = false,
}) => {
  const attachments = [
    getRoadmapItemAttachment({
      roadmapItem,
      moved: { oldStage, newStage },
      follow: !isFollowing,
    }),
  ];
  return {
    attachments,
    text: `*_${
      isFollowing ? `A roadmap item you're following` : `A roadmap item`
    } has moved_*`,
  };
};

module.exports = roadmapItemMoved;
