export async function denyNonAuthorized (ctx) {
  if (!ctx.state.user) ctx.throw(401, 'must authenticate to request this endpoint.')
}
