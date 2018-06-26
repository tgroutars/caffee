module.exports = ({
  backlogItem,
  suggestFollowers = false,
  openCard = null,
  showDescription = false,
  showShowMore = true,
  followers = null,
  stage = null,
  moved = null,
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
  if (openCard) {
    actions.push({
      type: 'button',
      text: 'Open Card in Trello',
      url: backlogItem.trelloCardURL,
    });
  }
  if (showShowMore) {
    actions.push({
      type: 'button',
      value: 'backlog_item_show_more',
      name: { type: 'backlog_item_show_more', backlogItemId: backlogItem.id },
      text: 'Show more',
    });
  }
  const followersList =
    followers && followers.map(user => user.name).join(', ');
  const footer =
    followersList &&
    `:eyes:  Followers (${followers.length}): ${followersList}`;

  const fields = [];
  if (moved) {
    fields.push({ title: 'From', value: moved.oldStage.name, short: true });
    fields.push({ title: 'To', value: moved.newStage.name, short: true });
  }
  if (stage) {
    fields.push({
      title: 'Stage',
      value: stage.name,
      short: true,
    });
  }

  return {
    actions,
    footer,
    fields,
    color: '#0079bf',
    title: backlogItem.title,
    text: showDescription ? backlogItem.description : undefined,
    callback_id: 'backlog_item',
  };
};
