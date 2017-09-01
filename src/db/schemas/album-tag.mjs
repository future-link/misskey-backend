import mongoose from 'mongoose'

import { commonSchemaOption } from '../common/transform'

const Schema = mongoose.Schema

export const schema = new Schema({
  color: {
    type: String,
    required: true },
  name: {
    type: String,
    required: true },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
}, commonSchemaOption)

export default db => db.model('AlbumTag', schema, 'AlbumTags')
