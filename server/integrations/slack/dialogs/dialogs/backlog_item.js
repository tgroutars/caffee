const backlogItem = ({
  productId,
  feedbackId,
  lists,
  defaultDescription = '',
  defaultTitle,
}) => {
  const callbackId = {
    type: 'backlog_item',
    productId,
    feedbackId,
  };

  const elements = [
    {
      label: 'List',
      name: 'trelloListRef',
      type: 'select',
      value: lists[0].id,
      options: lists.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
      optional: false,
    },
    {
      label: 'Title',
      name: 'title',
      type: 'text',
      value: defaultTitle,
      max_length: 150, // Maximum imposed by Slack
      optional: false,
    },
    {
      label: 'Description',
      name: 'description',
      type: 'textarea',
      value: defaultDescription,
      max_length: 3000, // Maximum imposed by Slack
      optional: true,
    },
  ];

  return {
    callback_id: callbackId,
    title: 'Backlog Item',
    submit_label: 'Create',
    elements,
  };
};

module.exports = backlogItem;
