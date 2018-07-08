const trim = require('lodash/trim');

const { SlackDialogSubmissionError } = require('../../../../../lib/errors');
const registerBackgroundTask = require('../../../../../lib/queue/registerBackgroundTask');
const {
  RoadmapItem: RoadmapItemService,
  Feedback: FeedbackService,
} = require('../../../../../services');
const {
  Feedback,
  SlackWorkspace,
  SlackUser,
} = require('../../../../../models');
const { updateMessage, postEphemeral } = require('../../../messages');

const createRoadmapItemBG = registerBackgroundTask(
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
    const roadmapItem = await RoadmapItemService.createAndSync({
      title,
      description,
      productId,
      stageId,
      tagId,
    });
    const slackUser = await SlackUser.find({ where: { slackId: userSlackId } });

    const product = await roadmapItem.getProduct();
    const workspace = await SlackWorkspace.findById(workspaceId);
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
  },
);

const roadmapItem = async (payload, { workspace }) => {
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

  await createRoadmapItemBG({
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

module.exports = roadmapItem;
