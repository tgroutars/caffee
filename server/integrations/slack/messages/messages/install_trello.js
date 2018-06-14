const installTrello = ({ installURL }) => {
  const pretext = "You haven't installed the Trello integration yet";
  const text = "You'll be redirected to Trello to connect your account";
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
        text,
        pretext,
        actions,
        callback_id: 'install_trello',
      },
    ],
  };
};

module.exports = installTrello;
