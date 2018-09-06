import { createSelector } from 'reselect';

import { currentProductSelector } from './product';

export const slackInstallsSelector = createSelector(
  currentProductSelector,
  product => product.slackInstalls,
);
