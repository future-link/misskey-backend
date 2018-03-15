import { getPropWithDefaultAndVerify } from './utils'

export const denyNonAuthorized = (ctx, next) => {
  if (!ctx.state.account)
    ctx.throw(401, 'must authenticate to request this endpoint.')
  return next()
}

/**
 * generate a middleware, validate limit & skip query and cast its and set casted to ctx.state.query
 * @param limitConfiguration Configuration
 * @param skipDefault integer of skip's default value
 * @type Configuration an Object has 'max' and 'default', both are integer
 * @returns Koa.middleware
 */
export const validateAndCastLimitAndSkip = ({ max: limitMax = 200, default: limitDefault = 100 } = {}, skipDefault = 0) => {
  return async (ctx, next) => {
    if (!ctx.state.query) ctx.state.query = {}
    await Promise.all([
      getPropWithDefaultAndVerify(ctx.query, 'limit', 100, v => {
        const n = Number.parseInt(v)
        if (!n) return false
        // must not over 200
        if (n > limitMax) return false
        // must not negative
        if (n <= 0) return false
        return true
      }, `query 'limit'`, ctx.throw).then(() => {
        ctx.state.query.limit = ctx.query.limit ? Number.parseInt(ctx.query.limit) : limitDefault
      }),
      getPropWithDefaultAndVerify(ctx.query, 'skip', 0, v => {
        const n = Number.parseInt(v)
        if (!n) return false
        // must not negative
        if (n <= 0) return false
        return true
      }, `query 'skip'`, ctx.throw).then(() => {
        ctx.state.query.skip = ctx.query.skip ? Number.parseInt(ctx.query.skip) : skipDefault
      })
    ])
    return await next()
  }
}
