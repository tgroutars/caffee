const trim = require('lodash/trim');

const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const registerBackgroundTask = require('../../../../../lib/queue/registerBackgroundTask');
const { BacklogItem: BacklogItemService } = require('../../../../../services');

const createBacklogItemBG = registerBackgroundTask(
  async ({ productId, title, description, feedbackId, trelloListRef }) => {
    const backlogItem = await BacklogItemService.create({
      title,
      description,
      productId,
      trelloListRef,
    });
    // TODO: associate feedback to backlog item
    return backlogItem;
  },
);

const backlogItem = async payload => {
  const { submission, callback_id: callbackId } = payload;
  const { productId, feedbackId } = callbackId;
  const { trelloListRef } = submission;
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
    feedbackId,
    trelloListRef,
  });
};

module.exports = backlogItem;
