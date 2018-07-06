const Promise = require('bluebird');

const { Feedback, User, SlackUser } = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');
const { addComment } = require('../../integrations/trello/helpers/api');

const feedbackProcessed = async ({ feedbackId, processedById }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: [
      'roadmapItem',
      'product',
      {
        model: User,
        as: 'author',
        include: [
          { model: SlackUser, as: 'slackUsers', include: ['workspace'] },
        ],
      },
    ],
  });
  const { roadmapItem, author } = feedback;
  const { slackUsers } = author;
  const processedBy = await User.findById(processedById);
  const postFeedbackProcessedMessage = postMessage('feedback_processed')({
    feedback,
    roadmapItem,
    processedBy,
  });

  await Promise.map(slackUsers, async slackUser => {
    const { workspace, slackId: userSlackId } = slackUser;
    const { accessToken } = workspace;
    await postFeedbackProcessedMessage({ accessToken, channel: userSlackId });
  });

  if (roadmapItem) {
    const { product } = feedback;
    const text = `**_New feedback from_** ${author.name}**_:_**\n\n${
      feedback.description
    }`;
    await addComment(product.trelloAccessToken, {
      cardId: roadmapItem.trelloRef,
      text,
    });
  }
};

module.exports = feedbackProcessed;
