const getBacklogItemAttachment = require('../attachments/backlog_item');

const backlogItemMoved = ({
  backlogItem,
  oldStage,
  newStage,
  isFollowing = false,
}) => {
  const attachments = [
    getBacklogItemAttachment({
      backlogItem,
      moved: { oldStage, newStage },
      follow: !isFollowing,
    }),
  ];
  return {
    attachments,
    text: `*_${
      isFollowing ? `A backlog item you're following` : `A backlog item`
    } has moved_*`,
  };
};

module.exports = backlogItemMoved;
