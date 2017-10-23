import ws from 'ws'
import cluster from 'cluster'
import util from 'util'

import Router from './router'

import msgpack from 'msgpack-lite'
import yaml from 'js-yaml'

import Logger from '../tools/logger'

const logger = new Logger(cluster.isWorker ? `app#${cluster.worker.id}` : 'app')

export default (...rest) => {
  const server = new ws.Server(...rest)

  const router = new Router()

  router.use(async (ctx, next) => {
    logger.log(`Upgrade Websocket ${ctx.path}, ${ctx.request.socket.localAddress}, ${ctx.request.headers['user-agent']}`)
    await next()
    ctx.socket.close()
  })

  // set-up `.ext` support
  const formats = ['json', 'msgpack', 'yaml']
  const formatters = {
    msgpack: msgpack.encode,
    yaml: yaml.safeDump
  }
  router.use((ctx, next) => {
    const ps = ctx.path.split('.')
    const format = ps.pop()
    let formatter = JSON.stringify
    if (formats.includes(format)) {
      // inject path
      ctx.path = ps.join('.')
      if (formatters[format]) formatter = formatters[format]
    }
    ctx.state.send = (...rest) => {
      ctx.socket.send(formatter(...rest))
    }
    return next()
  })

  router.use('/', (ctx, next) => {
    ctx.state.send({
      message: 'welcome to ws world',
      code: 0
    })
    return next()
  })

  router.use(async (ctx) => {
    await util.promisify(setTimeout)(5000)
    ctx.state.send({
      message: '5sec'
    })
  })

  // register router to server
  const callback = router.callback()
  server.on('connection', callback)

  return server
}
