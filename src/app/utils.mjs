export async function denyNonAuthorized (ctx) {
  if (!ctx.state.account) ctx.throw(401, 'must authenticate to request this endpoint.')
}

export async function getPropWithDefaultAndVerify (object, key, preset, verifier = null, pne = null) {
  if (!object[key]) return preset
  if (!verifier) return object[key]
  const vr = verifier(object[key])
  if (vr.constructor.name !== 'Promise' && vr) return object[key]
  if (await vr) return object[key]
  // verify error (pne: prop name in error)
  const e = new Error(`${pne || key} is invalid.`)
  // mimic ctx.throw's error
  e.expose = true
  e.status = 400
  throw e
}

export async function getLimitAndSkip (ctx) {
  const limit = Number.parseInt(await getPropWithDefaultAndVerify(ctx.query, 'limit', 100, v => {
    const n = Number.parseInt(v)
    if (!n) return false
    // must not over 200
    if (n > 200) return false
    // must not negative
    if (n <= 0) return false
    return true
  }, `query 'limit'`))
  const skip = Number.parseInt(await getPropWithDefaultAndVerify(ctx.query, 'skip', 0, v => {
    const n = Number.parseInt(v)
    if (!n) return false
    // must not negative
    if (n <= 0) return false
    return true
  }, `query 'skip'`))
  return [limit, skip]
}
