import mongoose from 'mongoose'
import mongooseAutoIncrement from 'mongoose-auto-increment'

import { commonSchemaOption } from '../common'

const Schema = mongoose.Schema

export const schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  cursor: {
    type: Number },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post' },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
}, commonSchemaOption)

export default db => {
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'PostLike',
    field: 'cursor'
  })
  return db.model('PostLike', schema, 'PostLikes')
}
