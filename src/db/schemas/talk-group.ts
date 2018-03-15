import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export const schema = new Schema({
  allowInvite: {
    type: Boolean,
    required: false,
    default: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  icon: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'AlbumFiles' },
  iconPath: {
    type: String,
    required: false,
    default: null },
  members: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'User' },
  name: {
    type: String,
    required: true },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
})

export default (db: mongoose.Connection) => db.model('TalkGroup', schema, 'TalkGroups')
