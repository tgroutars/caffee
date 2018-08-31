import { createSelector } from 'reselect';
import { matchPath } from 'react-router-dom';

import { currentProductSelector } from './product';

const filterFuncs = {
  unprocessed: feedback => !feedback.archivedAt && !feedback.roadmapItemId,
  processed: feedback => !!feedback.roadmapItemId,
  archived: feedback => !!feedback.archivedAt,
};

const feedbacksSelector = state => state.entities.feedbacks;
const currentPathnameSelector = state => state.router.location.pathname;
export const currentInboxSelector = createSelector(
  currentPathnameSelector,
  pathname => {
    const match = matchPath(pathname, '/manage/:productId/inbox/:inbox');

    if (!match) {
      return null;
    }

    return match.params.inbox;
  },
);

const allFeedbacksSelector = createSelector(
  currentProductSelector,
  feedbacksSelector,
  (product, feedbacks) => {
    if (!product || !product.feedbacks) {
      return [];
    }
    return product.feedbacks
      .map(feedbackId => feedbacks[feedbackId])
      .sort((f1, f2) => (f1.createdAt > f2.createdAt ? 1 : -1));
  },
);

export const unprocessedFeedbacksSelector = createSelector(
  allFeedbacksSelector,
  feedbacks => feedbacks.filter(filterFuncs.unprocessed),
);

export const currentFeedbacksSelector = createSelector(
  currentInboxSelector,
  allFeedbacksSelector,
  (inbox, feedbacks) => feedbacks.filter(filterFuncs[inbox]),
);

export const currentFeedbackIdSelector = createSelector(
  currentPathnameSelector,
  pathname => {
    const match = matchPath(
      pathname,
      '/manage/:productId/inbox/:inbox/:feedbackId',
    );
    if (!match) {
      return null;
    }

    return match.params.feedbackId;
  },
);

export const currentFeedbackSelector = createSelector(
  feedbacksSelector,
  currentFeedbackIdSelector,
  (feedbacks, feedbackId) => (feedbackId ? feedbacks[feedbackId] : null),
);

export const nbUnprocessedFeedbacksSelector = createSelector(
  unprocessedFeedbacksSelector,
  feedbacks => feedbacks.length,
);
