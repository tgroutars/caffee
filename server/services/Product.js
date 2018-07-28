const Promise = require('bluebird');
const winston = require('winston');
const SlackClient = require('@slack/client').WebClient;
const { getUserVals } = require('../integrations/slack/helpers/user');

const {
  Product,
  RoadmapItem,
  Tag,
  RoadmapStage,
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

const ProductService = services => ({
  async createTag(productId, { name, trelloRef }) {
    return Tag.findOrCreate({
      where: { productId, trelloRef },
      defaults: { name },
    });
  },

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

  async createFromSlackInstall({ accessToken, userSlackId, appId, appUserId }) {
    const slackClient = new SlackClient(accessToken);
    const { user: userInfo } = await slackClient.users.info({
      user: userSlackId,
    });
    const { team: workspaceInfo } = await slackClient.team.info();
    const {
      id: workspaceSlackId,
      name: workspaceName,
      icon: { image_132: workspaceImage },
      domain,
    } = workspaceInfo;

    const [workspace] = await services.SlackWorkspace.findOrCreate({
      accessToken,
      domain,
      appId,
      appUserId,
      slackId: workspaceSlackId,
      name: workspaceName,
      image: workspaceImage,
    });

    const userVals = getUserVals(userInfo);

    const [slackUser] = await services.SlackUser.findOrCreate({
      ...userVals,
      workspaceId: workspace.id,
    });

    const { user } = slackUser;

    const product = await this.create({
      name: workspaceName,
      image: workspaceImage,
      ownerId: user.id,
    });

    await product.addUser(user, { through: { role: 'admin' } });

    await services.SlackInstall.create({
      productId: product.id,
      workspaceId: workspace.id,
    });

    await this.doOnboarding(product.id, {
      onboardingStep: Product.ONBOARDING_STEPS['01_CHOOSE_PRODUCT_NAME'],
      slackUserId: slackUser.id,
    });

    return product;
  },

  async create({ name, image, ownerId }) {
    return Product.create({
      name,
      image,
      ownerId,
    });
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
        name: label.name,
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
      async ({ idList, name, desc, id, idLabels, closed }) => {
        const stage = stagesByTrelloRef[idList];
        const roadmapItem = await RoadmapItem.create({
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
});

module.exports = ProductService;
