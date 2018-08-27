import { schema } from 'normalizr';

export const user = new schema.Entity('users');
export const scope = new schema.Entity('scopes');
export const scopes = new schema.Array(scope);
export const feedback = new schema.Entity('feedbacks');
export const feedbacks = new schema.Array(feedback);

export const product = new schema.Entity('products', {
  scopes,
  feedbacks,
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
};
