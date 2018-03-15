import * as mongoose from 'mongoose'
import * as mongooseAutoIncrement from 'mongoose-auto-increment'
import { Application } from 'express';
import { IUser } from './user';
import { IAlbumFolder } from './album-folder';
import { IAlbumTag } from './album-tag';

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
})

export interface IAlbumFile extends mongoose.Document{
  app?: Application
  createdAt: Date
  cursor: number
  dataSize: number
  folder?: IAlbumFolder | mongoose.Types.ObjectId
  mimeType: string
  hash?: string
  isDeleted: boolean | any
  isHidden: boolean
  isPrivate: boolean
  name: string
  properties?: object
  serverPath?: string
  tags?: (IAlbumTag | mongoose.Types.ObjectId)[]
  user: IUser | mongoose.Types.ObjectId
}

export default (db: mongoose.Connection) => {
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'AlbumFile',
    field: 'cursor'
  })
  return db.model<IAlbumFile>('AlbumFile', schema, 'AlbumFiles')
}
