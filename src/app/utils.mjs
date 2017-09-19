export async function denyNonAuthorized (ctx) {
  if (!ctx.state.user) ctx.throw(401, 'must authenticate to request this endpoint.')
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
