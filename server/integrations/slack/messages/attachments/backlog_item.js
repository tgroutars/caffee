module.exports = ({
  backlogItem,
  suggestFollowers = false,
  trelloURL = null,
  showMore = false,
}) => {
  const actions = [
    {
      type: 'button',
      value: 'follow_backlog_item',
      name: {
        type: 'follow_backlog_item',
        backlogItemId: backlogItem.id,
      },
      text: 'Follow',
    },
  ];
  if (suggestFollowers) {
    actions.push({
      type: 'select',
      data_source: 'external',
      name: {
        type: 'backlog_item_suggest_follower',
        backlogItemId: backlogItem.id,
      },
      text: 'Suggest followers',
    });
  }
  if (trelloURL) {
    actions.push({
      type: 'button',
      text: 'Open Card in Trello',
      url: trelloURL,
    });
  }
  return {
    actions,
    color: '#0079bf',
    title: backlogItem.title,
    text: showMore ? backlogItem.description : undefined,
    callback_id: 'backlog_item',
  };
};
