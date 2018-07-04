const trim = require('lodash/trim');

const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const registerBackgroundTask = require('../../../../../lib/queue/registerBackgroundTask');
const {
  BacklogItem: BacklogItemService,
  Feedback: FeedbackService,
} = require('../../../../../services');
const { Feedback, SlackWorkspace } = require('../../../../../models');
const { updateMessage, postEphemeral } = require('../../../messages');

const createBacklogItemBG = registerBackgroundTask(
  async ({
    productId,
    title,
    description,
    tagId,
    feedbackId,
    stageId,
    feedbackMessageRef,
    workspaceId,
    channel,
    userSlackId,
  }) => {
    const backlogItem = await BacklogItemService.createAndSync({
      title,
      description,
      productId,
      stageId,
      tagId,
    });

    const product = await backlogItem.getProduct();
    const workspace = await SlackWorkspace.findById(workspaceId);
    const { accessToken } = workspace;

    if (feedbackId) {
      await FeedbackService.setBacklogItem(feedbackId, {
        backlogItemId: backlogItem.id,
      });
    }
    if (feedbackMessageRef) {
      const feedback = await Feedback.findById(feedbackId);
      await updateMessage('new_feedback')({
        feedback,
        backlogItem,
        product,
        backlogItemOptions: { openCard: true },
      })({
        accessToken,
        channel: feedbackMessageRef.channel,
        ts: feedbackMessageRef.ts,
      });
    }

    await postEphemeral('new_backlog_item')({
      backlogItem,
      product,
      openCard: true,
      suggestFollowers: true,
      follow: false,
    })({ accessToken, channel, user: userSlackId });

    return backlogItem;
  },
);

const backlogItem = async (payload, { workspace }) => {
  const {
    submission,
    callback_id: callbackId,
    channel: { id: channel },
    user: { id: userSlackId },
  } = payload;
  const { productId, feedbackId, feedbackMessageRef } = callbackId;
  const { stageId, tagId } = submission;
  const title = trim(submission.title);
  const description = trim(submission.description);
  if (!title) {
    throw new SlackDialogSubmissionError([
      {
        name: 'title',
        error: 'This field is required',
      },
    ]);
  }

  await createBacklogItemBG({
    productId,
    title,
    description,
    tagId,
    feedbackId,
    stageId,
    channel,
    userSlackId,
    feedbackMessageRef,
    workspaceId: workspace.id,
  });
};

module.exports = backlogItem;
