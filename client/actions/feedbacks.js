import api from './api';
import { addEntities } from './entities';

export const listFeedbacks = productId => async dispatch => {
  const { feedbacks } = await dispatch(api.feedbacks.list({ productId }));
  dispatch(addEntities('feedbacks', feedbacks));
  dispatch(addEntities('product', { id: productId, feedbacks }));
};
