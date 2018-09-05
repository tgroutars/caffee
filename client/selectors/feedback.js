import { createSelector } from 'reselect';
import { matchPath } from 'react-router-dom';
import { denormalize } from 'normalizr';
import {
  feedbacks as feedbacksSchema,
  feedback as feedbackSchema,
} from '../schemas';

import { currentProductSelector } from './product';

const filterFuncs = {
  unprocessed: feedback => !feedback.archivedAt && !feedback.roadmapItemId,
  processed: feedback => !!feedback.roadmapItemId,
  archived: feedback => !!feedback.archivedAt,
};

const entitiesSelector = state => state.entities;
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

const feedbacksSelector = createSelector(
  entitiesSelector,
  currentProductSelector,
  (entities, product) => {
    if (!product || !product.feedbacks) {
      return [];
    }
    return denormalize(product.feedbacks, feedbacksSchema, entities).sort(
      (f1, f2) => (f1.createdAt < f2.createdAt ? 1 : -1),
    );
  },
);

export const unprocessedFeedbacksSelector = createSelector(
  feedbacksSelector,
  feedbacks => feedbacks.filter(filterFuncs.unprocessed),
);

export const currentFeedbacksSelector = createSelector(
  currentInboxSelector,
  feedbacksSelector,
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
  entitiesSelector,
  currentFeedbackIdSelector,
  (entities, feedbackId) => denormalize(feedbackId, feedbackSchema, entities),
);

export const nbUnprocessedFeedbacksSelector = createSelector(
  unprocessedFeedbacksSelector,
  feedbacks => feedbacks.length,
);
