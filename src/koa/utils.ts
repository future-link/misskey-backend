export async function getPropWithDefaultAndVerify<T> (
  object: any, key: string, preset: T, verifier: ((input: any) => boolean) | null = null, pne: string | null = null, thrower = (status: number, message: string) => {
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

// TODO: ここの型もっとうまくやる
export async function resolveAllInObject (obj: {[key: string]: Promise<any>}) {
  const target: {[key: string]: any} = {}
  const keys = Object.keys(obj)
  const values = await Promise.all(Object.values(obj))
  values.forEach((v, i) => {
    target[keys[i]] = v
  })
  return target
}
