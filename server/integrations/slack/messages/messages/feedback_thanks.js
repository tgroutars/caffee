module.exports = ({ isAuthor = true, author, assignedTo }) => {
  let message = `*_Thanks for your feedback :pray:_*`;
  if (isAuthor) {
    message += `\nI sent it to *${
      assignedTo.name
    }* and will keep you up to date when they act on it`;
  } else {
    message += `\nI sent it to *${assignedTo.name}* and will keep *${
      author.name
    }* up to date when they act on it`;
  }
  return {
    text: message,
  };
};
