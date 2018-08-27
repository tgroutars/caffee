import { createSelector } from 'reselect';
import { matchPath } from 'react-router-dom';

import { currentProductSelector } from './product';

const filterFuncs = {
  unprocessed: feedback => !feedback.archivedAt && !feedback.roadmapItemId,
};

const feedbacksSelector = state => state.entities.feedbacks;
const currentPathnameSelector = state => state.router.location.pathname;
export const currentInboxSelector = createSelector(
  currentPathnameSelector,
  pathname => {
    const match = matchPath(pathname, '/manage/:productId/inbox/:inbox?');
    if (!match) {
      return null;
    }

    return match.params.inbox || 'unprocessed';
  },
);

const allFeedbacksSelector = createSelector(
  currentProductSelector,
  feedbacksSelector,
  (product, feedbacks) => {
    if (!product || !product.feedbacks) {
      return [];
    }
    return product.feedbacks.map(feedbackId => feedbacks[feedbackId]);
  },
);

export const currentFeedbacksSelector = createSelector(
  currentInboxSelector,
  allFeedbacksSelector,
  (inbox, feedbacks) => feedbacks.filter(filterFuncs[inbox]),
);
