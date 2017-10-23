import pathToRegexp from 'path-to-regexp'

const isFunction = (target) => target.constructor !== undefined && ['Promise', 'Function', 'AsyncFunction'].includes(target.constructor.name)
const generateObjectFromKVPairArrays = (ka, va) => {
  const temp = {}
  ka.forEach((v, i) => {
    temp[v] = va[i]
  })
  return temp
}

const contextGenerator = (prototype, socket, request) => Object.assign(
  {
    socket,
    request,
    state: {}
  },
  prototype
)

// router for ws 'connection' event
export default class {
  constructor() {
    this.handlers = []
    // editable prototype
    this.context = {}
  }

  eventRegister(f) {
    this.handlers.push(f)
  }

  use(...rest) {
    const [first, second = null] = rest
    const handler = second && isFunction(second) ? second : (isFunction(first) ? first : 'null')
    const pathString = typeof first === 'string' ? first : null

    if (!handler) throw new Error('must give handler.')

    if (!pathString) return this.eventRegister(handler)

    const pathMatcher = pathToRegexp(pathString)
    const pathMatchKeys = pathToRegexp.parse(pathString).filter(token => typeof token === 'object').map(token => token.name)
    return this.eventRegister((ctx, givenNext) => {
      const next = (...rest) => {
        // clean-up ctx.params
        delete ctx.params
        return givenNext(...rest)
      }

      const match = pathMatcher.exec(ctx.request.url)
      if (match) {
        ctx.params = generateObjectFromKVPairArrays(pathMatchKeys, match.slice(1))
        return handler(ctx, next)
      }
      return next()
    })
  }

  callback() {
    return (...rest) => {
      let currentHandlerIndex = 0
      const ctx = contextGenerator(this.context, ...rest)

      const nexter = () => {
        const next = this.handlers[++currentHandlerIndex]
        if (!next) return
        return next(ctx, nexter)
      }

      const firstHandler = this.handlers[currentHandlerIndex]
      if (!firstHandler) return

      const runner = async () => {
        try {
          await firstHandler(ctx, nexter)
        } catch (e) {
          if (ctx.socket.readyState === 1)
            ctx.socket.send('unknown error happened. this connection will be closed.')
          ctx.socket.close()
          console.error(e.stack)
          // re-throw
          throw e
        }
      }

      // go
      return runner()
    }
  }
}
