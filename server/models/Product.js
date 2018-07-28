const ONBOARDING_STEPS = {
  '01_CHOOSE_PRODUCT_NAME': '01_choose_product_name',
  '02_INSTALL_TRELLO': '02_install_trello',
  '03_CHOOSE_TRELLO_BOARD': '03_choose_trello_board',
  '04_CHOOSE_SLACK_CHANNEL': '04_choose_slack_channel',
  '05_COMPLETE': '05_complete',
};

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'product',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      ownerId: {
        type: DataTypes.UUID,
        field: 'owner_id',
      },
      trelloBoardId: {
        type: DataTypes.STRING,
        field: 'trello_board_id',
      },
      trelloAccessToken: {
        type: DataTypes.STRING,
        field: 'trello_access_token',
      },
      trelloAccessTokenSecret: {
        type: DataTypes.STRING,
        field: 'trello_access_token_secret',
      },
      onboardingStep: {
        type: DataTypes.STRING,
        field: 'onboarding_step',
        allowNull: true,
      },
      questions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
      },
    },
    {},
  );

  Product.ONBOARDING_STEPS = ONBOARDING_STEPS;

  /**
   * Associations
   */
  Product.associate = models => {
    const { User, ProductUser, RoadmapItem, Tag, RoadmapStage } = models;

    Product.belongsTo(User, {
      as: 'owner',
      onDelete: 'restrict',
      onUpdate: 'restrict',
      foreignKey: 'ownerId',
    });
    Product.hasMany(ProductUser, {
      as: 'productUsers',
      foreignKey: 'productId',
    });
    Product.belongsToMany(User, {
      as: 'users',
      through: ProductUser,
      foreignKey: 'productId',
      otherKey: 'userId',
    });
    Product.hasMany(RoadmapItem, {
      as: 'roadmapItems',
      foreignKey: 'productId',
    });
    Product.hasMany(Tag, {
      as: 'tags',
      foreignKey: 'productId',
    });
    Product.hasMany(RoadmapStage, {
      as: 'roadmapStages',
      foreignKey: 'productId',
    });
  };

  Product.prototype.getTrelloBoardURL = function getTrelloBoardURL() {
    return `https://trello.com/b/${this.trelloBoardId}`;
  };

  Product.prototype.getFeedbackForm = function getFeedbackForm(text) {
    const { questions } = this;
    const questionsText = questions
      .map(question => `*${question}*`)
      .join('\n\n');
    let feedbackForm = `${questionsText}\n`;
    if (text && questions.length) {
      feedbackForm = `${feedbackForm}\n\n----------------------\n\n`;
    }
    if (text) {
      feedbackForm = `${feedbackForm}${text}`;
    }
    return feedbackForm;
  };

  return Product;
};
