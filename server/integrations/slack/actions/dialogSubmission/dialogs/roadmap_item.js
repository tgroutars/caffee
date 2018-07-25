const trim = require('lodash/trim');

const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const {
  RoadmapItem: RoadmapItemService,
  Feedback: FeedbackService,
} = require('../../../../../services');
const { Feedback, SlackUser } = require('../../../../../models');
const { updateMessage, postEphemeral } = require('../../../messages');

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

const run = async (payload, { workspace }) => {
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

  const roadmapItem = await RoadmapItemService.createAndSync({
    title,
    description,
    productId,
    stageId,
    tagId,
  });
  const slackUser = await SlackUser.find({ where: { slackId: userSlackId } });

  const product = await roadmapItem.getProduct();
  const { accessToken } = workspace;

  if (feedbackId) {
    await FeedbackService.setRoadmapItem(feedbackId, {
      roadmapItemId: roadmapItem.id,
      processedById: slackUser.userId,
    });
  }
  if (feedbackMessageRef) {
    const feedback = await Feedback.findById(feedbackId, {
      include: ['author'],
    });
    const { author } = feedback;
    await updateMessage('new_feedback')({
      feedback,
      roadmapItem,
      product,
      author,
    })({
      accessToken,
      channel: feedbackMessageRef.channel,
      ts: feedbackMessageRef.ts,
    });
  }

  await postEphemeral('new_roadmap_item')({
    roadmapItem,
    product,
    isPM: true,
  })({ accessToken, channel, user: userSlackId });

  return roadmapItem;
};

module.exports = { validate, run };
