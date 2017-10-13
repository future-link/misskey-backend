export const denyNonAuthorized = (ctx, next) => {
  if (!ctx.state.account)
    ctx.throw(401, 'must authenticate to request this endpoint.')
  return next()
}
