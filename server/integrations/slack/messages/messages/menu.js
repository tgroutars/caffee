const menu = ({
  productId,
  files,
  defaultFeedback,
  defaultRoadmapItemTitle,
  defaultRoadmapItemDescription,
  defaultAuthorId,
  defaultAuthorName,
  settingsURL,
  createRoadmapItem = false,
}) => {
  const pretext = 'What can I do for you? 😊';
  const actions = [];
  if (createRoadmapItem) {
    actions.push({
      type: 'button',
      text: 'Create roadmap item',
      value: 'open_roadmap_item_dialog',
      name: {
        productId,
        files,
        defaultDescription: defaultRoadmapItemDescription,
        defaultTitle: defaultRoadmapItemTitle,
        type: 'open_roadmap_item_dialog',
      },
    });
  }
  actions.push({
    type: 'button',
    text: 'Send feedback',
    value: 'open_feedback_dialog',
    name: {
      productId,
      files,
      defaultAuthorId,
      defaultAuthorName,
      defaultFeedback,
      type: 'open_feedback_dialog',
    },
  });
  actions.push({
    type: 'button',
    text: 'View roadmap',
    value: 'view_roadmap',
    name: {
      productId,
      type: 'view_roadmap',
    },
  });
  if (settingsURL) {
    actions.push({
      type: 'button',
      url: settingsURL,
      text: 'Open Settings',
    });
  }
  return {
    attachments: [
      {
        pretext,
        actions,
        callback_id: 'menu',
      },
    ],
  };
};

module.exports = menu;
