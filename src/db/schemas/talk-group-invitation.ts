import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export const schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  group: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'TalkGroup' },
  isDeclined: {
    type: Boolean,
    required: false,
    default: false },
  text: {
    type: String,
    required: false,
    default: null },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
})

export default db => db.model('TalkGroupInvitation', schema, 'TalkGroupInvitations')
