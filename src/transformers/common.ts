import * as mongoose from 'mongoose'

export default (raw, Model = null) => {
  if (Model && !(raw instanceof Model)) throw Error(`can't pass common check of transformers.`)
  const object = raw.toObject()
  object.id = object._id
  delete object.__v
  delete object._id
  // transform 'ObjectId' object to string
  Object.entries(object).forEach(([k, v]) => {
    if (v instanceof mongoose.Types.ObjectId) object[k] = v.toString()
  })
  return object
}
