import mongoose from 'mongoose'
import mongooseAutoIncrement from 'mongoose-auto-increment'

import { commonSchemaOption } from '../common/transform'

const Schema = mongoose.Schema

export const schema = new Schema({
  app: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'Application' },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  cursor: {
    type: Number },
  dataSize: {
    type: Number,
    required: true },
  folder: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'AlbumFolder' },
  mimeType: {
    type: String,
    required: true },
  hash: {
    type: String,
    required: false,
    default: null },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false },
  isHidden: {
    type: Boolean,
    required: false,
    default: false },
  isPrivate: {
    type: Boolean,
    required: false,
    default: false },
  name: {
    type: String,
    required: true },
  properties: {
    type: Schema.Types.Mixed,
    required: false,
    default: null },
  serverPath: {
    type: String,
    required: false },
  tags: {
    type: [Schema.Types.ObjectId],
    required: false,
    default: null,
    ref: 'AlbumTag' },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
}, commonSchemaOption)

export default db => {
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'AlbumFile',
    field: 'cursor'
  })
  return db.model('AlbumFile', schema, 'AlbumFiles')
}
