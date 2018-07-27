const crypto = require('crypto');
const Promise = require('bluebird');
const mime = require('mime-types');

const { getURLFromKey, uploadFromURL } = require('../../../../lib/S3');
const { fetchAttachment } = require('../../helpers/api');
const { RoadmapItem } = require('../../../../models');
const { RoadmapItem: RoadmapItemService } = require('../../../../services');

const findOrUploadFile = async ({ name, id, url, bytes: size }) => {
  const mimetype = mime.lookup(name);
  const nameMatch = name.match(/^caffee:([A-z 0-9]+)_(.*)$/);
  if (nameMatch) {
    const [, key, realName] = nameMatch;
    return {
      key,
      size,
      mimetype,
      name: realName,
      url: getURLFromKey(key),
    };
  }
  const key = crypto
    .createHash('md5')
    .update(`trello_id:${id}`)
    .digest('hex');
  const { Location } = await uploadFromURL({ key, url });
  return {
    key,
    size,
    name,
    mimetype,
    url: Location,
  };
};

const addLabelToCard = async payload => {
  const {
    card,
    attachment: { id: attachmentId },
  } = payload.action.data;

  const roadmapItems = await RoadmapItem.findAll({
    where: { trelloRef: card.id },
    include: ['product'],
  });
  if (!roadmapItems.length) {
    return;
  }
  const { trelloAccessToken } = roadmapItems[0].product;
  const trelloAttachment = await fetchAttachment(trelloAccessToken, {
    attachmentId,
    cardId: card.id,
  });
  const attachment = await findOrUploadFile(trelloAttachment);
  await Promise.map(roadmapItems, async roadmapItem => {
    await RoadmapItemService.addAttachment(roadmapItem.id, attachment);
  });
};

module.exports = addLabelToCard;
