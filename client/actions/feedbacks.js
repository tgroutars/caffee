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

export const fetchFeedback = feedbackId => async dispatch => {
  const { feedback } = await dispatch(api.feedbacks.info({ feedbackId }));
  dispatch(addEntities('feedback', feedback));
};

export const setRoadmapItem = (feedbackId, roadmapItemId) => async dispatch => {
  const { feedback } = await dispatch(
    api.feedbacks.setRoadmapItem({ feedbackId, roadmapItemId }),
  );
  dispatch(addEntities('feedback', feedback));
};

export const archiveFeedback = (
  feedbackId,
  { archiveReason },
) => async dispatch => {
  const { feedback } = await dispatch(
    api.feedbacks.archive({ feedbackId, archiveReason }),
  );
  dispatch(addEntities('feedback', feedback));
};
