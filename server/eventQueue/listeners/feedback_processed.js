const Promise = require('bluebird');

const {
  Feedback,
  User,
  SlackUser,
  ProductUser,
  RoadmapItem,
} = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');
const { addComment } = require('../../integrations/trello/helpers/api');

const feedbackProcessed = async ({ feedbackId, processedById }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: [
      'product',
      { model: RoadmapItem, as: 'roadmapItem', include: ['stage'] },
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
  const { stage } = roadmapItem;
  const { slackUsers } = author;
  const processedBy = await User.findById(processedById);
  const productUser = await ProductUser.find({
    where: { productId: feedback.productId, userId: author.id },
  });
  const { isPM } = productUser;
  const postFeedbackProcessedMessage = postMessage('feedback_processed')({
    feedback,
    roadmapItem,
    processedBy,
    isPM,
    stage,
  });

  await Promise.map(slackUsers, async slackUser => {
    const { workspace, slackId: userSlackId } = slackUser;
    const { accessToken } = workspace;
    await postFeedbackProcessedMessage({ accessToken, channel: userSlackId });
  });

  if (roadmapItem) {
    const { product } = feedback;
    const text = `**_New feedback from ${author.name}:_**\n\n${
      feedback.description
    }`;
    await addComment(product.trelloAccessToken, {
      cardId: roadmapItem.trelloRef,
      text,
    });
  }
};

module.exports = feedbackProcessed;
