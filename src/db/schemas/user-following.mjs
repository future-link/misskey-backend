import mongoose from 'mongoose'
import mongooseAutoIncrement from 'mongoose-auto-increment'

import { commonSchemaOption } from '../common/transform'

const Schema = mongoose.Schema

export const schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  cursor: {
    type: Number },
  followee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' },
  follower: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
}, commonSchemaOption)

export default db => {
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'UserFollowing',
    field: 'cursor'
  })
  return db.model('UserFollowing', schema, 'UserFollowings')
}
