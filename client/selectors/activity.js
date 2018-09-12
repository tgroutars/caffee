import { createSelector } from 'reselect';
import { matchPath } from 'react-router-dom';

import { currentProductSelector } from './product';

const filterFuncs = {
  pending: activity => !activity.sentAt && !activity.discardedAt,
  sent: feedback => !!feedback.sentAt,
  discarded: feedback => !!feedback.discardedAt,
};

const entitiesSelector = state => state.entities;
const currentPathnameSelector = state => state.router.location.pathname;
export const currentFilterSelector = createSelector(
  currentPathnameSelector,
  pathname => {
    const match = matchPath(pathname, '/manage/:productId/updates/:filter');
    if (!match) {
      return null;
    }
    return match.params.filter;
  },
);

const activitiesSelector = createSelector(
  entitiesSelector,
  currentProductSelector,
  (entities, product) => {
    if (!product || !product.activities) {
      return [];
    }
    return product.activities;
  },
);

export const pendingActivitiesSelector = createSelector(
  activitiesSelector,
  feedbacks => feedbacks.filter(filterFuncs.pending),
);

export const currentActivitiesSelector = createSelector(
  activitiesSelector,
  currentFilterSelector,
  (activities, filter) => activities.filter(filterFuncs[filter]),
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

export const pendingActivitiesCountSelector = createSelector(
  pendingActivitiesSelector,
  activities => activities.length,
);
