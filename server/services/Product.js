const Promise = require('bluebird');
const winston = require('winston');

const {
  Product,
  RoadmapItem,
  Tag,
  RoadmapStage,
  ProductUser,
  Sequelize,
} = require('../models');
const { trigger } = require('../eventQueue/eventQueue');
const {
  listCards,
  createWebhook,
  listLabels,
  listLists,
  createBoard,
  createLabel,
  createList,
} = require('../integrations/trello/helpers/api');
const {
  findOrUploadFile,
} = require('../integrations/trello/helpers/attachments');

const DEFAULT_TAGS = [
  { name: 'Bug', color: 'red' },
  { name: 'Improvement', color: 'yellow' },
  { name: 'Feature', color: 'blue' },
];
const DEFAULT_STAGES = [
  { name: 'In consideration' },
  { name: 'In Progress' },
  { name: 'Released' },
];

const ProductService = () => ({
  async setName(productId, { name }) {
    await Product.update({ name }, { where: { id: productId } });
  },

  async doOnboarding(productId, { onboardingStep, slackUserId }) {
    await Product.update({ onboardingStep }, { where: { id: productId } });
    await trigger('onboarding', {
      onboardingStep,
      productId,
      slackUserId,
    });
  },

  async create({ name, image, ownerId }) {
    const product = await Product.create({
      name,
      image,
      ownerId,
    });
    await product.addUser(ownerId, { through: { role: 'admin' } });
    return product;
  },

  async setQuestions(productId, questions) {
    await Product.update({ questions }, { where: { id: productId } });
  },

  async setTrelloTokens(
    productId,
    { accessToken, accessTokenSecret, installer },
  ) {
    await Product.update(
      {
        trelloAccessToken: accessToken,
        trelloAccessTokenSecret: accessTokenSecret,
      },
      { where: { id: productId } },
    );
    await trigger('trello_installed', { productId, installer });
  },

  async setTrelloBoard(productId, boardId) {
    await Product.update(
      { trelloBoardId: boardId },
      { where: { id: productId } },
    );
    await trigger('product_trello_board_changed', { productId });
  },

  async createTrelloBoard(product) {
    const { trelloAccessToken } = product;
    const board = await createBoard(trelloAccessToken, {
      name: `${product.name} roadmap`,
      desc: `High-level roadmap for ${product.name}`,
      permissionLevel: 'public',
    });
    await Promise.map(DEFAULT_TAGS, async ({ name, color }) =>
      createLabel(trelloAccessToken, {
        name,
        color,
        boardId: board.id,
      }),
    );
    await Promise.map(DEFAULT_STAGES, async ({ name }, index) =>
      createList(trelloAccessToken, {
        name,
        pos: index + 1,
        boardId: board.id,
      }),
    );
    await this.setTrelloBoard(product.id, board.id);
  },

  // TODO: Danger => Trello limits API to 100 request per token per 10 second
  async syncTrelloBoard(product) {
    const { trelloAccessToken, trelloBoardId } = product;

    const cards = await listCards(trelloAccessToken, {
      boardId: trelloBoardId,
      includeAttachments: true,
    });
    const labels = await listLabels(trelloAccessToken, {
      boardId: trelloBoardId,
    });
    const lists = await listLists(trelloAccessToken, {
      boardId: trelloBoardId,
    });

    try {
      await createWebhook(trelloAccessToken, { modelId: trelloBoardId });
    } catch (err) {
      winston.error(
        `Could not create board webhook for productId=${
          product.id
        } boardRef=${trelloBoardId}`,
      );
    }

    // Remove old roadmap items
    await RoadmapItem.destroy({
      where: { productId: product.id },
    });
    // Remove old tags
    await Tag.destroy({ where: { productId: product.id } });
    // Remove old stages
    await RoadmapStage.destroy({ where: { productId: product.id } });

    // Add new tags
    const tags = await Promise.map(labels, async label =>
      Tag.create({
        productId: product.id,
        trelloRef: label.id,
        name: label.name || label.color,
      }),
    );
    const tagsByTrelloRef = tags.reduce(
      (res, tag) => ({
        ...res,
        [tag.trelloRef]: tag,
      }),
      {},
    );

    // Add new stages
    const stages = await Promise.map(lists, async list =>
      RoadmapStage.create({
        productId: product.id,
        name: list.name,
        trelloRef: list.id,
        position: list.pos,
        isArchived: list.closed,
      }),
    );
    const stagesByTrelloRef = stages.reduce(
      (res, stage) => ({
        ...res,
        [stage.trelloRef]: stage,
      }),
      {},
    );

    // Add new items
    await Promise.mapSeries(
      cards,
      async ({
        idList,
        name,
        desc,
        id,
        idLabels,
        closed,
        attachments: trelloAttachments,
      }) => {
        const attachments = await Promise.map(
          trelloAttachments.filter(({ isUpload }) => isUpload),
          async trelloAttachment => findOrUploadFile(trelloAttachment),
        );
        const stage = stagesByTrelloRef[idList];
        const roadmapItem = await RoadmapItem.create({
          attachments,
          productId: product.id,
          trelloRef: id,
          stageId: stage.id,
          title: name,
          description: desc,
          archivedAt: closed ? Sequelize.fn('NOW') : null,
        });
        const itemTags = idLabels.map(trelloRef => tagsByTrelloRef[trelloRef]);
        await roadmapItem.addTags(itemTags);
      },
    );
  },

  async addUser(productId, userId) {
    const [productUser] = await ProductUser.findOrCreate({
      where: { productId, userId },
      defaults: { role: 'author' },
    });
    return productUser;
  },

  async removeUser(productId, userId) {
    await ProductUser.destroy({
      where: { productId, userId },
    });
  },
});

module.exports = ProductService;
