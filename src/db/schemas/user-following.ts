import * as mongoose from 'mongoose'
import * as mongooseAutoIncrement from 'mongoose-auto-increment'

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
})

export default (db: mongoose.Connection) => {
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'UserFollowing',
    field: 'cursor'
  })
  return db.model('UserFollowing', schema, 'UserFollowings')
}
