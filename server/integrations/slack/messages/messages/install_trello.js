const installTrello = ({ installURL }) => {
  const pretext = 'Click here to connect Trello :point_down:';
  const actions = [
    {
      type: 'button',
      text: 'Connect Trello',
      url: installURL,
    },
  ];
  return {
    attachments: [
      {
        pretext,
        actions,
        callback_id: 'install_trello',
      },
    ],
  };
};

module.exports = installTrello;
