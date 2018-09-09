// TODO: Put jobs in queue
const winston = require('winston');
const Promise = require('bluebird');
const SlackClient = require('@slack/client').WebClient;
const moment = require('moment');

const { SlackWorkspace, Sequelize } = require('../server/models');

const { Op } = Sequelize;

const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } = process.env;

const rotateSlackTokens = async () => {
  const workspaces = await SlackWorkspace.findAll({
    where: {
      tokenExpiresAt: {
        [Op.ne]: null,
      },
    },
  });
  await Promise.map(workspaces, async workspace => {
    try {
      const slackClient = new SlackClient();
      const {
        access_token: accessToken,
        expires_in: expiresIn,
      } = await slackClient.oauth.access({
        refresh_token: workspace.refreshToken,
        client_id: SLACK_CLIENT_ID,
        client_secret: SLACK_CLIENT_SECRET,
        grant_type: 'refresh_token',
      });
      const tokenExpiresAt = moment().add(expiresIn, 'seconds');
      await workspace.update({ tokenExpiresAt, accessToken });
    } catch (err) {
      winston.error(err);
    }
  });
};

rotateSlackTokens()
  .catch(err => {
    winston.error(err);
  })
  .then(() => process.exit());
