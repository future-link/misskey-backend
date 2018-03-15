export async function getPropWithDefaultAndVerify (
  object, key, preset, verifier = null, pne = null, thrower = (status, message) => {
    throw new Error(message)
  }
) {
  if (!object[key]) return preset
  if (!verifier) return object[key]
  const vr = verifier(object[key])
  if (vr.constructor.name !== 'Promise' && vr) return object[key]
  if (await vr) return object[key]
  // verify error (pne: prop name in error)
  thrower(400, `${pne || key} is invalid.`)
}

export async function resolveAllInObject (obj) {
  const target = {}
  const keys = Object.keys(obj)
  const values = await Promise.all(Object.values(obj))
  values.forEach((v, i) => {
    target[keys[i]] = v
  })
  return target
}
