const uniq = require('lodash/uniq');

const { SlackUser } = require('../../../models');

const CHANNEL_REGEX = /<#([A-Z0-9_]+)\|([A-zÀ-ú0-9_-]+)>/g;
const USER_REGEX = /<@([A-Z0-9]+)(?:\|([A-Za-z0-9_]+))?>/g;
const FULL_USER_REGEX = /<@([A-Z0-9]+)\|([A-Za-z0-9_]+)>/g;
const replaceUserRegex = userSlackId =>
  new RegExp(`<@${userSlackId}(?:\\|[A-Za-z0-9]+)?>`, 'g');

const decode = workspace => {
  const decodeSlackUsers = async text => {
    const userMatches = uniq(text.match(USER_REGEX));
    if (!userMatches) {
      return text;
    }
    const userSlackIds = userMatches.map(match =>
      match.replace(USER_REGEX, '$1'),
    );
    const slackUsers = await SlackUser.findAll({
      where: { slackId: userSlackIds, workspaceId: workspace.id },
    });
    return slackUsers
      .reduce(
        (res, slackUser) =>
          res.replace(
            replaceUserRegex(slackUser.slackId),
            `@${slackUser.name}`,
          ),
        text,
      )
      .replace(new RegExp(`<@${workspace.appUserId}>`, 'g'), '@Caffee')
      .replace(FULL_USER_REGEX, '@$2');
  };

  const decodeChannels = text => text.replace(CHANNEL_REGEX, '#$2');

  const decodeChars = text =>
    text
      .replace(new RegExp('&amp;', 'g'), '&')
      .replace(new RegExp('&lt;', 'g'), '<')
      .replace(new RegExp('&gt;', 'g'), '>');

  return async text =>
    decodeChars(decodeChannels(await decodeSlackUsers(text)));
};

module.exports = { decode };
