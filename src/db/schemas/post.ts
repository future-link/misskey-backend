import * as mongoose from 'mongoose'
import * as mongooseAutoIncrement from 'mongoose-auto-increment'
import { IUser } from './user';
import { IAlbumFile } from './album-file';
import { IApplication } from './application';

const Schema = mongoose.Schema

const generalSchemaObject = {
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
  isDeleted: {
    type: Boolean,
    required: false,
    default: false },
  nextPost: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'Post' },
  prevPost: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'Post' },
  // デフォルトは投稿タイプ毎のスキーマで追記します
  type: {
    type: String,
    required: true },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
}

interface IPostGeneric extends mongoose.Document {
  app?: IApplication | mongoose.Types.ObjectId
  createdAt: Date
  cursor: number
  isDeleted: boolean | any
  nextPost: IPost | mongoose.Types.ObjectId
  prevPost: IPost | mongoose.Types.ObjectId
  type: string
  user: IUser | mongoose.Types.ObjectId
}

// like, reply, repostが可能なタイプ向けの統合スキーマ
const nonRepostSchemaObject = Object.assign({
  likesCount: {
    type: Number,
    required: false,
    default: 0 },
  repliesCount: {
    type: Number,
    required: false,
    default: 0 },
  repostsCount: {
    type: Number,
    required: false,
    default: 0 },
  files: {
    type: [Schema.Types.ObjectId],
    required: false,
    default: null,
    ref: 'AlbumFile' },
  hashtags: {
    type: [String],
    required: false,
    default: [] },
  text: {
    type: String,
    required: false,
    default: null }
}, generalSchemaObject)

interface IPostNonRepost extends IPostGeneric{
  likesCount: number
  repliesCount: number
  repostsCount: number
  files?: (IAlbumFile | mongoose.Types.ObjectId)[]
  hashtags: string[]
  text: string
}

const enableAutoincrement = (db: mongoose.Connection, schema: mongoose.Schema) => {
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'Post',
    field: 'cursor'
  })
}

export const PostSchema = new Schema(generalSchemaObject)
export const StatusSchema = new Schema(Object.assign({
  type: {
    type: String,
    required: true,
    default: 'status' }
}, nonRepostSchemaObject))
export const ReplySchema = new Schema(Object.assign({
  inReplyToPost: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'Post' },
  type: {
    type: String,
    required: true,
    default: 'reply' }
}, nonRepostSchemaObject))
export const RepostSchema = new Schema(Object.assign({
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post' },
  type: {
    type: String,
    required: true,
    default: 'repost' }
}, generalSchemaObject))

export type IPost = IPostGeneric
export interface IPostStatus extends IPost {
  type: "status"
}

export interface IPostReply extends IPost {
  inReplyToPost: IPost | mongoose.Types.ObjectId
  type: "reply"
}

export interface IPostRepost extends IPost {
  post: IPost | mongoose.Types.ObjectId
  type: "repost"
}

const post = (db: mongoose.Connection) => db.model<IPost>('Post', PostSchema, 'Posts')
const status = (db: mongoose.Connection) => {
  enableAutoincrement(db, StatusSchema)
  return db.model<IPostStatus>('Status', StatusSchema, 'Posts')
}
const reply = (db: mongoose.Connection) => {
  enableAutoincrement(db, ReplySchema)
  return db.model<IPostReply>('Reply', ReplySchema, 'Posts')
}
const repost = (db: mongoose.Connection) => {
  enableAutoincrement(db, RepostSchema)
  return db.model<IPostRepost>('Repost', RepostSchema, 'Posts')
}
export { post, status, reply, repost }
