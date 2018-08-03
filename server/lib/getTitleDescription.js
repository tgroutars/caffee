const trim = require('lodash/trim');
const truncate = require('lodash/truncate');

const getTitleDescription = (
  rawText,
  { maxTitleLength = 150, maxDescriptionLength = 3000 } = {},
) => {
  const text = trim(rawText);
  const textParts = text.split('\n');
  const [fullTitle] = textParts;
  const [, ...textRest] = textParts;
  let title = fullTitle;
  let description = trim(textRest.join('\n'));
  if (title.length > maxTitleLength) {
    title = truncate(title, {
      length: maxTitleLength,
      omission: '...',
    });
    const titleRest = fullTitle.substring(title.length - 3);
    description = `...${titleRest}\n\n${description}`;
    description = truncate(description, {
      length: maxDescriptionLength,
      omission: '...',
    });
  }
  return { title, description };
};

module.exports = getTitleDescription;
