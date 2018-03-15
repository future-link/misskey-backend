import * as mongoose from 'mongoose'
import { IUser } from './user';

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

export interface IAlbumTag extends mongoose.Document {
  color: string
  name: string
  user: IUser | mongoose.Types.ObjectId
}

export default (db: mongoose.Connection) => db.model<IAlbumTag>('AlbumTag', schema, 'AlbumTags')
