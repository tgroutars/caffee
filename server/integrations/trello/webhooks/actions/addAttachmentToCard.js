const Promise = require('bluebird');

const { fetchAttachment } = require('../../helpers/api');
const { findOrUploadFile } = require('../../helpers/attachments');
const { RoadmapItem } = require('../../../../models');
const { RoadmapItem: RoadmapItemService } = require('../../../../services');

const addAttachmentToCard = async payload => {
  const {
    card,
    attachment: { id: attachmentId },
  } = payload.action.data;

  const roadmapItems = await RoadmapItem.findAll({
    where: { trelloRef: card.id, archivedAt: null },
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

module.exports = addAttachmentToCard;
