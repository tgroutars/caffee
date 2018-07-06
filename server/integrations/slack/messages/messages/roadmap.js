const defaults = require('lodash/defaults');

module.exports = ({
  roadmapItems,
  product,
  stages,
  stageId,
  page = 0,
  pageCount = 0,
}) => {
  const isLastPage = page + 1 >= pageCount;
  const defaultNavName = {
    page,
    stageId,
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

  navAttachment.actions.push({
    type: 'select',
    text: 'Status',
    name: defaults({ page: 0 }, defaultNavName),
    options: stages.map(stage => ({
      text: stage.name,
      value: {
        stageId: stage.id,
      },
    })),
  });

  attachments.push(navAttachment);
  return {
    text: `*_${product.name} roadmap_*`,
    attachments,
  };
};
