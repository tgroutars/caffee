const trim = require('lodash/trim');
const Promise = require('bluebird');

const { syncFile } = require('../../../helpers/files');
const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const {
  RoadmapItem: RoadmapItemService,
  Feedback: FeedbackService,
} = require('../../../../../services');
const { postEphemeral } = require('../../../messages');

const validate = async payload => {
  const { submission } = payload;
  const title = trim(submission.title);
  if (!title) {
    throw new SlackDialogSubmissionError([
      {
        name: 'title',
        error: 'This field is required',
      },
    ]);
  }
};

const run = async (payload, { workspace, slackUser }) => {
  const {
    submission,
    callback_id: callbackId,
    channel: { id: channel },
  } = payload;
  const { productId, feedbackId, files = [] } = callbackId;
  const { stageId, tagId } = submission;
  const title = trim(submission.title);
  const description = trim(submission.description);

  const { accessToken } = workspace;

  if (files.length) {
    await postEphemeral('processing_roadmap_item')()({
      accessToken,
      channel,
      user: slackUser.slackId,
    });
  }

  const attachments = await Promise.map(files, async file =>
    syncFile(file, accessToken),
  );

  const roadmapItem = await RoadmapItemService.createAndSync({
    title,
    description,
    productId,
    stageId,
    attachments,
    tagIds: [tagId],
  });

  if (feedbackId) {
    await FeedbackService.setRoadmapItem(feedbackId, {
      roadmapItemId: roadmapItem.id,
      processedById: slackUser.userId,
    });
  }

  await postEphemeral('roadmap_item_create_confirm')({
    roadmapItem,
  })({ accessToken, channel, user: slackUser.slackId });

  return roadmapItem;
};

module.exports = { validate, run };
