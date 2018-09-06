import { schema } from 'normalizr';

export const user = new schema.Entity('users');
export const users = new schema.Array(user);
export const scope = new schema.Entity('scopes');
export const scopes = new schema.Array(scope);
export const attachment = new schema.Entity(
  'attachments',
  {},
  { idAttribute: 'key' },
);
export const attachments = new schema.Array(attachment);
export const roadmapStage = new schema.Entity('roadmapStages');
export const roadmapStages = new schema.Array(roadmapStage);
export const tag = new schema.Entity('tags');
export const tags = new schema.Array(tag);
export const roadmapItem = new schema.Entity('roadmapItems', {
  stage: roadmapStage,
  tags,
});
export const roadmapItems = new schema.Array(roadmapItem);
export const feedbackComment = new schema.Entity('feedbackComments');
export const feedbackComments = new schema.Array(feedbackComment);
export const feedback = new schema.Entity('feedbacks', {
  attachments,
  roadmapItem,
  comments: feedbackComments,
});
export const feedbacks = new schema.Array(feedback);
export const slackInstall = new schema.Entity('slackInstalls');
export const slackInstalls = new schema.Array(slackInstall);
export const product = new schema.Entity('products', {
  scopes,
  feedbacks,
  roadmapItems,
  roadmapStages,
  tags,
  users,
  slackInstalls,
});
export const products = new schema.Array(product);

export default {
  user,
  users,
  scope,
  scopes,
  product,
  products,
  feedbackComment,
  feedbackComments,
  feedback,
  feedbacks,
  attachment,
  attachments,
  roadmapStage,
  roadmapStages,
  tag,
  tags,
  roadmapItem,
  roadmapItems,
  slackInstall,
  slackInstalls,
};
