require('events').EventEmitter.defaultMaxListeners = 25;

const http = require('http');

const Koa = require('koa');
const enforceHttps = require('koa-sslify');
const koaLogger = require('koa-logger');
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
app.use(koaBodyParser());

// Routes
app.use(router.routes(), router.allowedMethods());

const server = http.createServer(app.callback());

module.exports = server;
