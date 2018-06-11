require('events').EventEmitter.defaultMaxListeners = 25;

const path = require('path');
const http = require('http');

const Koa = require('koa');
const enforceHttps = require('koa-sslify');
const koaLogger = require('koa-logger');
const koaBodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');

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

app.use(koaStatic(path.join(__dirname, '../dist')));
app.use(koaStatic(path.join(__dirname, '../public')));

// Routes
app.use(router.routes());

const server = http.createServer(app.callback());

module.exports = server;
