import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export const schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  userId: {
    type: Schema.Types.ObjectId,
    required: true },
  appKey: {
    type: String,
    required: true },
  callbackUrl: {
    type: String,
    required: false,
    default: null },
  description: {
    type: String,
    required: true },
  iconId: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null },
  permissions: {
    type: [String],
    required: true },
  isSuspended: {
    type: Boolean,
    required: false,
    default: false },
  idDeleted: {
    type: Boolean,
    required: false,
    default: false }
})

export default (db: mongoose.Connection) => db.model('Application', schema, 'Applications')
