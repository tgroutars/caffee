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
  return feedbacks;
};

export const fetchFeedback = feedbackId => async dispatch => {
  const { feedback } = await dispatch(api.feedbacks.info({ feedbackId }));
  dispatch(addEntities('feedback', feedback));
  return feedback;
};

export const setRoadmapItem = (feedbackId, roadmapItemId) => async dispatch => {
  const { feedback } = await dispatch(
    api.feedbacks.setRoadmapItem({ feedbackId, roadmapItemId }),
  );
  dispatch(addEntities('feedback', feedback));
  return feedback;
};

export const archiveFeedback = (
  feedbackId,
  { archiveReason },
) => async dispatch => {
  const { feedback } = await dispatch(
    api.feedbacks.archive({ feedbackId, archiveReason }),
  );
  dispatch(addEntities('feedback', feedback));
  return feedback;
};

export const setNewRoadmapItem = (
  feedbackId,
  { productId, title, description, tagIds, stageId },
) => async dispatch => {
  const { roadmapItem } = await dispatch(
    api.roadmapItems.create({
      productId,
      title,
      description,
      tagIds,
      stageId,
    }),
  );
  const feedback = await dispatch(setRoadmapItem(feedbackId, roadmapItem.id));
  dispatch(addEntities('roadmapItem', roadmapItem));
  dispatch(
    addEntities('product', { id: productId, roadmapItems: [roadmapItem] }),
  );
  dispatch(addEntities('feedback', feedback));
};

export const addComment = (feedbackId, { text }) => async (
  dispatch,
  getState,
) => {
  const { comment } = await dispatch(
    api.feedbacks.addComment({ feedbackId, text }),
  );
  dispatch(addEntities('feedbackComment', comment));
  const { comments } = getState().entities.feedbacks[feedbackId];
  const newComments = [...comments, comment.id];
  dispatch(addEntities('feedback', { id: feedbackId, comments: newComments }));
};
