const { User, ProductUser, Sequelize } = require('../../../../../models');

const { Op } = Sequelize;

const feedbackAuthorId = async payload => {
  const { callback_id: callbackId, value } = payload;
  const { productId } = callbackId;
  const productUsers = await ProductUser.findAll({
    where: { productId },
    include: [
      {
        model: User,
        as: 'user',
        where: {
          name: {
            [Op.iLike]: `%${value.replace('%', '\\%')}%`,
          },
        },
      },
    ],
  });

  return productUsers.map(({ user }) => ({
    label: user.name,
    value: user.id,
  }));
};

module.exports = feedbackAuthorId;
