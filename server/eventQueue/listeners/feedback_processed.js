const Promise = require('bluebird');
const winston = require('winston');

const {
  Feedback,
  User,
  SlackWorkspace,
  ProductUser,
  RoadmapItem,
  FeedbackComment,
} = require('../../models');
const { RoadmapItem: RoadmapItemService } = require('../../services');
const { postMessage } = require('../../integrations/slack/messages');
const { addComment } = require('../../integrations/trello/helpers/api');

const feedbackProcessed = async ({ feedbackId, processedById }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: [
      'product',
      'author',
      'externalRefs',
      { model: RoadmapItem, as: 'roadmapItem', include: ['stage'] },
      { model: FeedbackComment, as: 'comments', include: ['author'] },
    ],
  });
  const { roadmapItem, author, comments, attachments, externalRefs } = feedback;
  const { stage } = roadmapItem;

  const processedBy = await User.findById(processedById);
  const productUser = await ProductUser.find({
    where: { productId: feedback.productId, userId: author.id },
  });
  const { isPM } = productUser;
  const postFeedbackProcessedMessage = postMessage('feedback_processed')({
    roadmapItem,
    processedBy,
    isPM,
    stage,
  });

  await Promise.map(externalRefs, async externalRef => {
    const { workspaceId, channel, ts } = externalRef.props;
    const workspace = await SlackWorkspace.findById(workspaceId);
    const { accessToken } = workspace;
    try {
      await postFeedbackProcessedMessage({
        accessToken,
        channel,
        threadTS: ts,
        replyBroadcast: true,
      });
    } catch (err) {
      winston.error(err);
    }
  });

  const { product } = feedback;
  let text = `**New feedback from ${author.name}:**\n\n${feedback.description}`;
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
  await Promise.map(feedback.attachments, async attachment =>
    RoadmapItemService.addAttachmentAndSync(roadmapItem.id, attachment),
  );
};

module.exports = feedbackProcessed;
