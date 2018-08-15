import { schema } from 'normalizr';

export const user = new schema.Entity('users');
export const scope = new schema.Entity('scopes');
export const scopes = new schema.Array(scope);
export const product = new schema.Entity('products', {
  scopes,
});

export default {
  user,
  scope,
  scopes,
  product,
};
