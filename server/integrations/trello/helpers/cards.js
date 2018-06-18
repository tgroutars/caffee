const getCardURL = backlogItem =>
  `https://trello.com/c/${backlogItem.trelloRef}`;

module.exports = {
  getCardURL,
};
