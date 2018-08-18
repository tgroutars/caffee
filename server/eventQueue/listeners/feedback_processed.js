const Promise = require('bluebird');
const winston = require('winston');

const {
  Feedback,
  User,
  SlackUser,
  ProductUser,
  RoadmapItem,
  FeedbackComment,
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
      { model: FeedbackComment, as: 'comments', include: ['author'] },
    ],
  });
  const { roadmapItem, author, comments, attachments } = feedback;
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
    try {
      await postFeedbackProcessedMessage({ accessToken, channel: userSlackId });
    } catch (err) {
      winston.error(err);
    }
  });

  if (roadmapItem) {
    const { product } = feedback;
    let text = `**New feedback from ${author.name}:**\n\n${
      feedback.description
    }`;
    if (comments.length) {
      text = `${text}\n\n**Discussion**`;
      comments.forEach(comment => {
        let commentText = comment.text;
        if (comment.attachments.length) {
          const attachmentLinks = comment.attachments
            .map(({ name, url }) => `[${name}](${url})`)
            .join('\n');
          commentText = `${commentText}\n${attachmentLinks}`;
        }
        text = `${text}\n***${comment.author.name}***\n${commentText}`;
      });
    }
    if (attachments.length) {
      text = `${text}\n\n**Attachments**\n${attachments.map(
        ({ name, url }) => `[${name}](${url})`,
      )}`;
    }
    await addComment(product.trelloAccessToken, {
      cardId: roadmapItem.trelloRef,
      text,
    });
  }
};

module.exports = feedbackProcessed;
