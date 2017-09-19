import Koa from 'koa'
import route from 'koa-route'
import cluster from 'cluster'
import msgpack from 'msgpack-lite'

import hash from '../tools/git-hash'
import Logger from '../tools/logger'

const app = new Koa()
const logger = new Logger(cluster.isWorker ? `app#${cluster.worker.id}` : 'app')

// access logging
app.use(async (ctx, next) => {
  // ex: 2017/08/30 22:59:26 +0900 | app#6 | GET /, ::1, Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36
  logger.log(`${ctx.method} ${ctx.path}, ${ctx.ip}, ${ctx.headers['user-agent']}`)
  await next()
  logger.detail(`- responded with status code ${ctx.status}`)
})

// response time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const duration = Date.now() - start
  ctx.set('X-Response-Time', `${duration} ms`)

  logger.detail(`- responded in ${duration} ms`)
})

// support `.ext`
const formats = [ 'json', 'msgpack' ]
const formatters = {
  msgpack: {
    mime: 'application/x-msgpack',
    processor: msgpack.encode
  }
}
app.use(async (ctx, next) => {
  const ps = ctx.path.split('.')

  // when path has no extension type, continue normal middleware chaining
  if (ps.length === 1) {
    await next()
    return
  }

  const format = ps.pop()
  // when unsupported extension type, stop middleware chaining
  if (!formats.includes(format)) {
    ctx.status = 400
    ctx.body = {
      message: 'unsupported extension type specified.'
    }
    return
  }

  // inject path with itself without extension
  ctx.path = ps.join('.')
  await next()

  if (!ctx.body || !formatters[format]) return
  ctx.type = formatters[format].mime
  ctx.body = formatters[format].processor(ctx.body)
})

// error handling
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    // without ctx.throw, need logging
    if (!e.expose) logger.error(e.stack)
    ctx.status = e.expose ? e.status : 500
    ctx.body = {
      message: e.expose ? e.message : 'an unexpected error has occurred, please contact to operators.'
    }
  }
})

// custom error for 404
app.use(async (ctx, next) => {
  await next()
  if (!ctx.body && ctx.status === 404) {
    ctx.status = 404
    ctx.body = {
      message: 'there is no contents.'
    }
  }
})

// CORS
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  await next()
})

// status
app.use(route.get('/', async (ctx) => {
  ctx.body = {
    hash
  }
}))

export { app as default, logger }
