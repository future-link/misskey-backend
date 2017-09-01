import route from 'koa-route'

// ルート定義ファイルの読み込み
import define from './define'

// this拘束したいのでアローしない
const wrapper = function (ctx, ...rest) {
  const next = rest.pop()
  ctx.body = this.handler(...rest)
}

// ハンドラーラッパー生成
const createWrapper = (handlerDefine) => {
  const handler = handlerDefine.handler
  return wrapper.bind({
    handler
  })
}

export default (app) => {
  Object.entries(define).forEach(([method, handlerDefines]) => {
    handlerDefines.forEach(handlerDefine => {
      app.use(
        route[method](
          handlerDefine.path,
          createWrapper(handlerDefine)
        )
      )
    })
  })
}
