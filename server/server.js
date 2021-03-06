require('events').EventEmitter.defaultMaxListeners = 150;

const http = require('http');
const path = require('path');

const Koa = require('koa');
const enforceHttps = require('koa-sslify');
const koaLogger = require('koa-logger');
const koaStatic = require('koa-static');
const koaBodyParser = require('koa-bodyparser');

const { init: initEventListeners } = require('./eventQueue/listeners');
const router = require('./router');

initEventListeners();

const app = new Koa();

app.proxy = true;

if (process.env.NODE_ENV === 'production') {
  app.use(
    enforceHttps({
      trustProtoHeader: true,
    }),
  );
}

if (process.env.NODE_ENV !== 'test') {
  app.use(koaLogger());
}
app.use(koaStatic(path.join(__dirname, '../dist')));

app.use(koaBodyParser());

// Routes
app.use(router.routes(), router.allowedMethods());

const server = http.createServer(app.callback());

module.exports = server;
