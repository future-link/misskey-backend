import mongoose from 'mongoose'
import mongooseAutoIncrement from 'mongoose-auto-increment'

const Schema = mongoose.Schema

export const schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  color: {
    type: String,
    required: true },
  cursor: {
    type: Number },
  name: {
    type: String,
    required: false,
    default: '' },
  parent: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'AlbumFolder' },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
})

export default db => {
  mongooseAutoIncrement.initialize(db)
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'AlbumFolder',
    field: 'cursor'
  })
  return db.model('AlbumFolder', schema, 'AlbumFolders')
}
