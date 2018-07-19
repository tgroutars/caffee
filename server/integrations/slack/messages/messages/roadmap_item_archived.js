const getRoadmapItemAttachment = require('../attachments/roadmap_item');

module.exports = ({ roadmapItem, isFollowing = false }) => {
  const attachments = [
    getRoadmapItemAttachment({
      roadmapItem,
      follow: false,
    }),
  ];
  return {
    attachments,
    text: `*_${
      isFollowing ? `A roadmap item you're following` : `A roadmap item`
    } has been archived_*`,
  };
};
