const Router = require('koa-router');
const pick = require('lodash/pick');

const { requireAuth, findProduct, requireAdmin } = require('./middleware');
const { Scope: ScopeService } = require('../../services');
const { Scope } = require('../../models');
const { APIError } = require('./errors');

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
    'isArchived',
  ]),
  responsible: pick(scope.responsible, ['id', 'name', 'image']),
});

const findScope = async (ctx, next) => {
  const { scopeId } = ctx.request.body;
  const scope = await Scope.findById(scopeId, { include: ['product'] });
  if (!scope) {
    throw new APIError('scope_not_found');
  }
  ctx.state.scope = scope;
  ctx.state.product = scope.product;
  await next();
};

router.post('/scopes.list', requireAuth, findProduct, async ctx => {
  const { product } = ctx.state;
  const scopes = await product.getScopes({
    order: [['level', 'asc']],
    include: ['responsible'],
  });
  ctx.send({ scopes: scopes.map(serializeScope) });
});

router.post(
  '/scopes.setName',
  requireAuth,
  findScope,
  requireAdmin,
  async ctx => {
    const { name, scopeId } = ctx.request.body;
    await ScopeService.setName(scopeId, {
      name,
    });
    const scope = await Scope.findById(scopeId, { include: ['responsible'] });
    ctx.send({ scope: serializeScope(scope) });
  },
);

router.post(
  '/scopes.create',
  requireAuth,
  findProduct,
  requireAdmin,
  async ctx => {
    const { name, parentId, productId } = ctx.request.body;
    const scope = await ScopeService.create({
      parentId,
      productId,
      name,
    });
    await scope.reload({ include: ['responsible'] });
    ctx.send({ scope: serializeScope(scope) });
  },
);

router.post(
  '/scopes.archive',
  requireAuth,
  findScope,
  requireAdmin,
  async ctx => {
    const { scopeId } = ctx.request.body;
    await ScopeService.archive(scopeId);
    const scope = await Scope.unscoped().findById(scopeId, {
      include: ['responsible'],
    });
    ctx.send({ scope: serializeScope(scope) });
  },
);

module.exports = router;
