import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as cluster from 'cluster'
import * as mongoose from 'mongoose'

import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import * as util from 'util'

import * as msgpack from 'msgpack-lite'
import * as yaml from 'js-yaml'

import hash from '../tools/git-hash'
import Logger from '../tools/logger'

import config from '../config'

import * as routes from './routes'

import { Account, Post, File } from '../db/mongodb'
import { syncConnect as redisSyncConnect } from '../db/redis'

import { resolveAllInObject } from './utils'

const app = new Koa()
const router = new Router()
const logger = new Logger(cluster.isWorker ? `app#${cluster.worker.id}` : 'app')
const redis = redisSyncConnect()

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

// CORS
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  if (ctx.method === 'OPTIONS' && ctx.header['access-control-request-method']) {
    ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type')
    ctx.status = 204
    return
  }
  await next()
})

// support `.ext`
const formats = ['json', 'msgpack', 'yaml']
const formatters = {
  msgpack: {
    mime: 'application/x-msgpack',
    processor: msgpack.encode
  },
  yaml: {
    mime: 'text/vnd.yaml',
    processor: yaml.safeDump
  }
}
app.use(async (ctx, next) => {
  ctx.state.format = ''

  const ps = ctx.path.split('.')

  // when path has no extension type, continue normal middleware chaining
  if (ps.length === 1) {
    await next()
    return
  }

  const format = ps.pop()
  // when unsupported extension type, continue normal middleware chaining
  if (!formats.includes(format)) {
    await next()
    return
  }

  // inject path with itself without extension
  ctx.state.format = format
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
    if (!e.expose || config.flags.verbose) logger.error(e.stack)
    ctx.status = e.expose ? e.status : 500
    ctx.body = {
      message: e.expose ? e.message : 'an unexpected error has occurred, please contact to operators.'
    }
  }
})

// custom error for 404
app.use(async (ctx, next) => {
  await next()
  if (!ctx.body && ctx.status === 404) ctx.throw(404, 'there are no contents.')
})

// account authenticate
const schemes = ['bearer', 'basic']
const authenticater = {
  // will be with misskey-auth
  bearer: async token => null,
  // basic for the time being, will be removed
  basic: async token => {
    const [id, secret] = Buffer.from(token, 'base64').toString().split(':')

    // get account
    let account
    if (id.startsWith('@')) {
      account = await Account.findOne({
        screenNameLower: id.substr(1).toLowerCase()
      })
    } else {
      if (!mongoose.Types.ObjectId.isValid(id)) return null
      account = await Account.findById(id)
    }
    if (!account) return null

    // load cache
    const srhs = await util.promisify(redis.get.bind(redis))(`mb:auth:basic:${account.id}`)
    if (srhs) {
      const srhsa = srhs.split('+')
      const salt = srhsa.shift()
      const goal = srhsa.join('+')
      if (crypto.createHash('sha512').update(`${salt}+${secret}`).toString('hex') === goal) return account
    }

    // verify secret by bcrypt
    if (!(await bcrypt.compare(secret, account.encryptedPassword))) return null

    // cache 1hour with redis
    const crsalt = crypto.randomBytes(16).toString('hex')
    const crhs = crypto.createHash('sha512').update(`${crsalt}+${secret}`).toString('hex')
    const exptime = 1 * 60 * 60
    redis.set(`mb:auth:basic:${account.id}`, `${crsalt}+${crhs}`, 'EX', exptime)

    return account
  }
}
app.use(async (ctx, next) => {
  ctx.state.account = null

  if (!ctx.headers['authorization']) {
    await next()
    return
  }

  const as = ctx.headers['authorization'].split(' ')
  const scheme = as.shift().toLowerCase()
  const value = as.join(' ')

  if (!schemes.includes(scheme)) ctx.throw(400, 'unsupported authorization scheme specified.')

  const account = await authenticater[scheme](value)
  if (!account) ctx.throw(400, 'incorrect authentication information specified.')

  ctx.state.account = account
  await next()
})

router.get('/', async (ctx) => {
  ctx.body = {
    hash,
    counts: await resolveAllInObject({
      accounts: Account.count(),
      files: File.count(),
      posts: Post.count().ne('type', 'repost')
    })
  }
})
// add entry for routes
Object.entries(routes).forEach(([prefix, routes])=> router.use(`/${prefix}`, routes.routes()))

app.use(router.routes())

export { app as default, logger }
