import mongoose from 'mongoose'
import mongooseAutoIncrement from 'mongoose-auto-increment'

import { commonSchemaOption } from '../common'

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

const enableAutoincrement = (db, schema) => {
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'Post',
    field: 'cursor'
  })
}

export const PostSchema = new Schema(generalSchemaObject, commonSchemaOption)
export const StatusSchema = new Schema(Object.assign({
  type: {
    type: String,
    required: true,
    default: 'status' }
}, nonRepostSchemaObject), commonSchemaOption)
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
}, nonRepostSchemaObject), commonSchemaOption)
export const RepostSchema = new Schema(Object.assign({
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post' },
  type: {
    type: String,
    required: true,
    default: 'repost' }
}, generalSchemaObject), commonSchemaOption)

const post = db => db.model('Post', PostSchema, 'Posts')
const status = db => {
  enableAutoincrement(db, StatusSchema)
  return db.model('Status', StatusSchema, 'Posts')
}
const reply = db => {
  enableAutoincrement(db, ReplySchema)
  return db.model('Reply', ReplySchema, 'Posts')
}
const repost = db => {
  enableAutoincrement(db, RepostSchema)
  return db.model('Repost', RepostSchema, 'Posts')
}
export { post, status, reply, repost }
