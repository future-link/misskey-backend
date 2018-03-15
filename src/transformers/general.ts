import * as mongoose from "mongoose"
import common from './common'

export default async (raw: mongoose.Document) => {
  return common(raw)
}
