import { schema } from 'normalizr';

export const user = new schema.Entity('users');
export const product = new schema.Entity('products');

export default {
  user,
  product,
};
