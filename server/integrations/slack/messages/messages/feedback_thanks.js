module.exports = ({ isAuthor = true, author }) => {
  let message = `*_Thanks for your feedback :pray:_*`;
  if (isAuthor) {
    message += `\nI'll keep you up to date when the product team acts on it`;
  } else {
    message += `\nI'll keep *${
      author.name
    }* up to date when the product team acts on it`;
  }
  return {
    text: message,
  };
};
