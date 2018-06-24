const Promise = require('bluebird');

const {
  Feedback,
  ProductUser,
  User,
  SlackUser,
  Sequelize,
} = require('../../models');
const { postMessage } = require('../../integrations/slack/messages');

const { Op } = Sequelize;

const feedbackCreated = async ({ feedbackId }) => {
  const feedback = await Feedback.findById(feedbackId, {
    include: ['product'],
  });
  const { product, createdById, authorId } = feedback;

  const productUsersToNotify = await ProductUser.findAll({
    where: { productId: product.id, role: { [Op.in]: ['user', 'admin'] } },
    include: [
      {
        model: User,
        as: 'user',
        include: [
          { model: SlackUser, as: 'slackUsers', include: ['workspace'] },
        ],
      },
    ],
  });
  const usersToNotify = productUsersToNotify.map(({ user }) => user);
  const postNewFeedback = postMessage('new_feedback')({ feedback, product });

  await Promise.map(usersToNotify, async ({ slackUsers }) => {
    await Promise.map(slackUsers, async slackUser => {
      const { workspace } = slackUser;
      const { accessToken } = workspace;
      await postNewFeedback({ accessToken, channel: slackUser.slackId });
    });
  });
  if (authorId !== createdById) {
    const [author, createdBy] = await Promise.all([
      User.findById(authorId, {
        include: [
          { model: SlackUser, as: 'slackUsers', include: ['workspace'] },
        ],
      }),
      User.findById(createdById),
    ]);
    await Promise.map(author.slackUsers, async slackUser => {
      const { workspace } = slackUser;
      const { accessToken } = workspace;
      await postMessage('feedback_created_by')({ createdBy, feedback })({
        accessToken,
        channel: slackUser.slackId,
      });
    });
  }
};

module.exports = feedbackCreated;
