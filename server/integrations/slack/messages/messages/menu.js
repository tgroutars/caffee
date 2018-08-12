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
  const pretext = 'Hi there :wave: What do you want to do?';
  const actions = [];
  if (createRoadmapItem) {
    actions.push({
      type: 'button',
      text: 'Create a new roadmap item',
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
    text: 'Send a new feedback',
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
      text: 'Settings',
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
