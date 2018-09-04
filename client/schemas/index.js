import { schema } from 'normalizr';

export const user = new schema.Entity('users');
export const scope = new schema.Entity('scopes');
export const scopes = new schema.Array(scope);
export const attachment = new schema.Entity(
  'attachments',
  {},
  { idAttribute: 'key' },
);
export const attachments = new schema.Array(attachment);
export const feedback = new schema.Entity('feedbacks', {
  attachments,
});
export const feedbacks = new schema.Array(feedback);
export const stage = new schema.Entity('stages');
export const stages = new schema.Array(stage);
export const roadmapItem = new schema.Entity('roadmapItems', { stage });
export const roadmapItems = new schema.Array(roadmapItem);
export const product = new schema.Entity('products', {
  scopes,
  feedbacks,
  roadmapItems,
});
export const products = new schema.Array(product);

export default {
  user,
  scope,
  scopes,
  product,
  products,
  feedback,
  feedbacks,
  attachment,
  attachments,
  stage,
  stages,
  roadmapItem,
  roadmapItems,
};
