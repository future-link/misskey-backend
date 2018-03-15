import * as mongoose from 'mongoose'
import { IAlbumFile } from './album-file';
import { IUser } from './user';

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

export interface ITalkGroup extends mongoose.Document{
  allowInvite: boolean
  createdAt: Date
  icon?: IAlbumFile | mongoose.Types.ObjectId
  iconPath: string
  members: (IUser | mongoose.Types.ObjectId)[]
  name: string
  owner: IUser | mongoose.Types.ObjectId
}

export default (db: mongoose.Connection) => db.model<ITalkGroup>('TalkGroup', schema, 'TalkGroups')
