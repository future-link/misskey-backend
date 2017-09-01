import route from 'koa-route'

// ルート定義ファイルの読み込み
import define from './define'

export default (app) => {
  Object.entries(define).forEach(([method, handlerDefines]) => {
    handlerDefines.forEach(handlerDefine => {
      app.use(
        route[method](
          handlerDefine.path,
          handlerDefine.handler
        )
      )
    })
  })
}
