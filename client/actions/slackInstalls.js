import api from './api';
import { addEntities } from './entities';

export const listSlackInstalls = productId => async dispatch => {
  const { slackInstalls } = await dispatch(
    api.slackInstalls.list({ productId }),
  );
  dispatch(addEntities('product', { id: productId, slackInstalls }));
  return slackInstalls;
};

export const listChannels = slackInstallId => async dispatch => {
  const { channels } = await dispatch(
    api.slackInstalls.listChannels({ slackInstallId }),
  );
  return channels;
};

export const setChannel = (slackInstallId, channel) => async dispatch => {
  const { slackInstall } = await dispatch(
    api.slackInstalls.setChannel({ slackInstallId, channel }),
  );
  dispatch(addEntities('slackInstall', slackInstall));
};
