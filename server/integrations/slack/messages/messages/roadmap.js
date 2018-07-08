const defaults = require('lodash/defaults');

const getRoadmapItemAttachment = require('../attachments/roadmap_item');

const orderString = {
  date: 'Most recent',
  followers: 'Most followed',
};

module.exports = ({
  roadmapItems,
  product,
  stages,
  filterStage,
  page = 0,
  pageCount = 0,
  order = 'date',
}) => {
  const isLastPage = page + 1 >= pageCount;
  const defaultNavName = {
    page,
    order,
    stageId: filterStage && filterStage.id,
    productId: product.id,
    type: 'navigate_roadmap',
  };

  const attachments = roadmapItems.map(roadmapItem =>
    getRoadmapItemAttachment({
      product,
      roadmapItem,
      followers: roadmapItem.followers,
      stage: roadmapItem.stage,
    }),
  );

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
    text: `Status: ${filterStage ? filterStage.name : 'All'}`,
    name: defaults({ page: 0 }, defaultNavName),
    options: [
      {
        text: 'All',
        value: {
          stageId: null,
        },
      },
      ...stages.map(stage => ({
        text: stage.name,
        value: {
          stageId: stage.id,
        },
      })),
    ],
  });

  navAttachment.actions.push({
    type: 'select',
    text: `Order: ${orderString[order]}`,
    name: defaults({ page: 0 }, defaultNavName),
    options: [
      {
        text: 'Most recent',
        value: {
          order: 'date',
        },
      },
      {
        text: 'Most followed',
        value: {
          order: 'followers',
        },
      },
    ],
  });

  attachments.push(navAttachment);
  return {
    text: `*_${product.name} roadmap_*`,
    attachments,
  };
};
