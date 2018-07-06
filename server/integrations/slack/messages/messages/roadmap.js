const defaults = require('lodash/defaults');

module.exports = ({ roadmapItems, product, page = 0, pageCount = 0 }) => {
  const isLastPage = page >= pageCount;
  const defaultNavName = {
    page,
    productId: product.id,
    type: 'navigate_roadmap',
  };

  const attachments = roadmapItems.map(roadmapItem => {
    const { followers, stage } = roadmapItem;
    const followerCount = followers.length;
    const footer = followerCount
      ? `:eyes: Following (${followerCount}): ${followers
          .map(follower => follower.name)
          .join(', ')}`
      : ':eyes: No Follower';
    return {
      text: `${roadmapItem.title}`,
      fields: [
        {
          title: 'Status',
          value: stage.name,
          short: true,
        },
      ],
      footer,
    };
  });

  const navAttachment = {
    title: `Navigate (${page + 1}/${pageCount})`,
    actions: [],
    callback_id: 'roadmap',
  };
  if (page > 0) {
    navAttachment.actions.push({
      type: 'button',
      text: 'Previous',
      value: 'navigate_roadmap',
      name: defaults({ page: page - 1 }, defaultNavName),
    });
  }
  if (!isLastPage) {
    navAttachment.actions.push({
      type: 'button',
      text: 'Next',
      value: 'navigate_roadmap',
      name: defaults({ page: page + 1 }, defaultNavName),
    });
  }

  attachments.push(navAttachment);
  return {
    text: `*_${product.name} roadmap_*`,
    attachments,
  };
};
