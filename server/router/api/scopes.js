const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth, findProduct, requireAdmin } = require('./middleware');
const { Scope: ScopeService } = require('../../services');

const router = new Router();

const serializeScope = scope => ({
  ...pick(scope, [
    'id',
    'name',
    'level',
    'responsibleId',
    'parentId',
    'productId',
    'createdAt',
  ]),
  responsible: pick(scope.responsible, ['id', 'name', 'image']),
});

router.post('/scopes.list', requireAuth, findProduct, async ctx => {
  const { product } = ctx.state;
  const scopes = await product.getScopes({
    order: [['level', 'asc']],
    include: ['responsible'],
  });
  ctx.send({ scopes: scopes.map(serializeScope) });
});

router.post(
  '/scopes.create',
  requireAuth,
  findProduct,
  requireAdmin,
  async ctx => {
    const { product } = ctx.state;
    const { name, responsibleId, parentId } = ctx.request.body;
    const scope = await ScopeService.create({
      name,
      responsibleId,
      parentId,
      productId: product.id,
    });
    ctx.send({ scope: serializeScope(scope) });
  },
);

module.exports = router;
