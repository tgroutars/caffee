module.exports = ({
  roadmapItem,
  follow = true,
  suggestFollowers = false,
  openCard = null,
  showDescription = false,
  showShowMore = true,
  followers = null,
  stage = null,
  moved = null,
}) => {
  const actions = [];
  if (follow) {
    actions.push({
      type: 'button',
      value: 'follow_roadmap_item',
      name: {
        type: 'follow_roadmap_item',
        roadmapItemId: roadmapItem.id,
      },
      text: 'Follow',
    });
  }
  if (suggestFollowers) {
    actions.push({
      type: 'select',
      data_source: 'external',
      name: {
        type: 'roadmap_item_suggest_follower',
        roadmapItemId: roadmapItem.id,
      },
      text: 'Suggest followers',
    });
  }
  if (openCard) {
    actions.push({
      type: 'button',
      text: 'Open Card in Trello',
      url: roadmapItem.trelloCardURL,
    });
  }
  if (showShowMore) {
    actions.push({
      type: 'button',
      value: 'roadmap_item_show_more',
      name: { type: 'roadmap_item_show_more', roadmapItemId: roadmapItem.id },
      text: 'Show more',
    });
  }

  let footer = '';
  if (followers) {
    const followerCount = followers && followers.length;
    footer = followerCount
      ? `:eyes: Following (${followerCount}): ${followers
          .map(follower => follower.name)
          .join(', ')}`
      : ':eyes: No Follower';
  }

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
    title: roadmapItem.title,
    text: showDescription ? roadmapItem.description : undefined,
    callback_id: 'roadmap_item',
  };
};
