import * as mongoose from 'mongoose'
import * as mongooseAutoIncrement from 'mongoose-auto-increment'
import { IUser } from './user';

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

export interface IAlbumFolder extends mongoose.Document {
  createdAt: Date
  color: string
  cursor: number
  name: string
  parent?: IAlbumFolder | mongoose.Types.ObjectId
  user: IUser | mongoose.Types.ObjectId
}

export default (db: mongoose.Connection) => {
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'AlbumFolder',
    field: 'cursor'
  })
  return db.model<IAlbumFolder>('AlbumFolder', schema, 'AlbumFolders')
}
