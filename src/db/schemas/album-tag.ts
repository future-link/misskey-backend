import * as mongoose from 'mongoose'

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
})

export default (db: mongoose.Connection) => db.model('AlbumTag', schema, 'AlbumTags')
