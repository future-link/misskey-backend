import Koa from 'koa'
import cluster from 'cluster'

import Logger from './tools/logger'

import config from './config'

import routeRegister from './routes'

export default () => {

  const loggerName = cluster.isWorker ? `server:${cluster.worker.id}` : 'server'
  const logger = new Logger(loggerName)

  const app = new Koa()

  // アクセスログ
  app.use(async (ctx, next) => {
    const start = Date.now()
    // 次のミドルウエアがエラーハンドルを行いエラーがあった場合はエラーを返してくる
    const error = await next()
    const duration = Date.now() - start
    // ex. `2017/08/30 22:59:26 +0900 | server:6 | GET /, 404, ::1, Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36`
    logger.log(`${ctx.method} ${ctx.url}, ${ctx.status}, ${ctx.ip}, ${ctx.headers['user-agent']}`)
    // エラーが合った場合はログに残す
    if (error) {
      const logLevel = error.expose ? 'detail' : 'error'
      logger[logLevel](error.stack)
    }
    // レスポンス時間を送信
    logger.detail(`- responded in ${duration} ms`)
    ctx.set('X-Responce-Time', `${duration} ms`)
  })

  // エラーハンドラ
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      // エラーがctx.throwによって生成されたモノか確認する
      ctx.status = e.expose ? e.status : 500
      ctx.body = {
        message: e.expose ? e.message : 'an unexpected error has occurred, please contact to operators.'
      }
      // 親のミドルウエアにログ記録の為にエラーを渡す
      return e
    }
  })

  // 何もなかった時にカスタムエラーを吐く
  app.use(async (ctx, next) => {
    await next()
    if (!ctx.body && ctx.status === 404) {
      ctx.status = 404
      ctx.body = {
        message: 'there is no contents.'
      }
    }
  })

  routeRegister(app)

  app.listen(config.port)

}
