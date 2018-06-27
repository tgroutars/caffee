const trim = require('lodash/trim');

const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const registerBackgroundTask = require('../../../../../lib/queue/registerBackgroundTask');
const {
  BacklogItem: BacklogItemService,
  Feedback: FeedbackService,
} = require('../../../../../services');
const { Feedback, SlackWorkspace } = require('../../../../../models');
const { updateMessage } = require('../../../messages');

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
  }) => {
    const backlogItem = await BacklogItemService.createAndSync({
      title,
      description,
      productId,
      stageId,
      tagId,
    });

    if (feedbackId) {
      await FeedbackService.setBacklogItem(feedbackId, {
        backlogItemId: backlogItem.id,
      });
    }
    if (feedbackMessageRef) {
      const feedback = await Feedback.findById(feedbackId, {
        include: ['product'],
      });
      const workspace = await SlackWorkspace.findById(workspaceId);
      const { product } = feedback;
      await updateMessage('new_feedback')({
        feedback,
        backlogItem,
        product,
        backlogItemOptions: { openCard: true },
      })({
        accessToken: workspace.accessToken,
        channel: feedbackMessageRef.channel,
        ts: feedbackMessageRef.ts,
      });
    }

    return backlogItem;
  },
);

const backlogItem = async (payload, { workspace }) => {
  const { submission, callback_id: callbackId } = payload;
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
    feedbackMessageRef,
    workspaceId: workspace.id,
  });
};

module.exports = backlogItem;
