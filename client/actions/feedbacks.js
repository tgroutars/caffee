import { push } from 'connected-react-router';

import * as routes from '../lib/routes';
import api from './api';
import { addEntities } from './entities';
import {
  currentFeedbackIdSelector,
  currentFeedbacksSelector,
  currentInboxSelector,
} from '../selectors/feedback';
import { currentProductIdSelector } from '../selectors/product';

export const listFeedbacks = productId => async (dispatch, getState) => {
  const { feedbacks } = await dispatch(api.feedbacks.list({ productId }));
  dispatch(addEntities('feedbacks', feedbacks));
  dispatch(addEntities('product', { id: productId, feedbacks }));
  const state = getState();
  const currentFeedbackId = currentFeedbackIdSelector(state);
  const currentFeedbacks = currentFeedbacksSelector(state);
  const currentInbox = currentInboxSelector(state);
  if (!currentFeedbackId && currentFeedbacks.length) {
    const currentProductId = currentProductIdSelector(state);
    dispatch(
      push(
        routes.manageFeedback({
          inbox: currentInbox,
          productId: currentProductId,
          feedbackId: currentFeedbacks[0].id,
        }),
      ),
    );
  }
};
