const backlogItem = ({
  tags,
  productId,
  feedbackId,
  backlogStages,
  defaultDescription = '',
  defaultTitle = '',
  feedbackMessageRef,
}) => {
  const callbackId = {
    type: 'backlog_item',
    productId,
    feedbackId,
    feedbackMessageRef,
  };

  const elements = [
    {
      label: 'List',
      name: 'stageId',
      type: 'select',
      value: backlogStages.length && backlogStages[0].id,
      options: backlogStages.map(({ id, name }) => ({
        label: name,
        value: id,
      })),
      optional: false,
    },
    ...(tags.length
      ? [
          {
            label: 'Label',
            name: 'tagId',
            type: 'select',
            options: tags.map(({ id, name }) => ({
              label: name,
              value: id,
            })),
            optional: true,
          },
        ]
      : []),
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
