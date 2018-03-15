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
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post' },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
})

export default (db: mongoose.Connection) => {
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'PostLike',
    field: 'cursor'
  })
  return db.model('PostLike', schema, 'PostLikes')
}
