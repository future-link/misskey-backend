import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export const schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  cursor: {
    type: Number,
    required: true },
  isRead: {
    type: Boolean,
    required: false,
    default: false },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post' },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
})

export default db => db.model('PostMention', schema, 'PostMentions')
