import Koa from 'koa'
import route from 'koa-route'
import cluster from 'cluster'
import msgpack from 'msgpack'

import hash from '../tools/git-hash'
import Logger from '../tools/logger'

const app = new Koa()
const logger = new Logger(cluster.isWorker ? `app#${cluster.worker.id}` : 'app')

// access logging
app.use(async (ctx, next) => {
  // ex: 2017/08/30 22:59:26 +0900 | app#6 | GET /, ::1, Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36
  logger.log(`${ctx.method} ${ctx.url}, ${ctx.ip}, ${ctx.headers['user-agent']}`)
  const start = Date.now()
  // wait next middleware
  await next()
  // set respoce time
  const duration = Date.now() - start
  ctx.set('X-Responce-Time', `${duration} ms`)
  // more datail for debug (only showes in verbose mode)
  logger.detail(`- responded in ${duration} ms`)
  logger.detail(`- responded with status code ${ctx.status}`)
})

// support `.ext`
const formats = [ 'json', 'msgpack' ]
const formatters = {
  msgpack: {
    mime: 'application/x-msgpack',
    processor: msgpack.pack
  }
}
app.use(async (ctx, next) => {
  const ps = ctx.path.split('.')
  if (ps.length === 1) return await next()
  const format = ps[1]
  if (!formats.includes(format)) {
    ctx.status = 400
    ctx.body = {
      message: 'unsupported extension type specified.'
    }
    return
  }
  await next()
  if (ctx.body && formatters[format]) {
    ctx.type = formatters[format].mime
    ctx.body = formatters[format].processor(ctx.body)
  }
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

// status
app.use(route.get('/', async (ctx) => {
  ctx.body = {
    hash
  }
}))

export { app as default, logger }
