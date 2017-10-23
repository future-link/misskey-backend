import ws from 'ws'
import cluster from 'cluster'

import Router from './router'

import Logger from '../tools/logger'

const logger = new Logger(cluster.isWorker ? `app#${cluster.worker.id}` : 'app')

export default (...rest) => {
  const server = new ws.Server(...rest)

  const router = new Router()
  router.use(async (ctx, next) => {
    logger.log(`Upgrade Websocket ${ctx.request.url}, ${ctx.request.socket.localAddress}, ${ctx.request.headers['user-agent']}`)
    ctx.state.send = (obj) => { ctx.socket.send(JSON.stringify(obj)) }
    await next()
    ctx.socket.close()
  })
  router.use('/', async (ctx, next) => {
    ctx.state.send({
      message: 'welcome to ws world'
    })
  })

  // register router to server
  const callback = router.callback()
  server.on('connection', callback)

  return server
}
