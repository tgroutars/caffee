const Promise = require('bluebird');
const SlackClient = require('@slack/client').WebClient;

const { FeedbackComment, Feedback, SlackWorkspace } = require('../../models');

module.exports = async ({ feedbackCommentId }) => {
  const comment = await FeedbackComment.findById(feedbackCommentId, {
    include: [
      { model: Feedback, as: 'feedback', include: ['externalRefs'] },
      'author',
    ],
  });
  const { feedback, text, author } = comment;
  const { externalRefs } = feedback;
  const originRefId = comment.feedbackExternalRefId;
  await Promise.map(externalRefs, async externalRef => {
    if (externalRef.id === originRefId) {
      return;
    }
    const { workspaceId, channel, ts: threadTS } = externalRef.props;

    const workspace = await SlackWorkspace.findById(workspaceId);
    const slackClient = new SlackClient(workspace.accessToken);
    await slackClient.chat.postMessage({
      attachments: [
        {
          title: author.name,
          text,
        },
      ],
      channel,
      thread_ts: threadTS,
      icon_url: author.image,
      username: author.name,
    });
  });
};
