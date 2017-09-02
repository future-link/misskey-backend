import mongoose from 'mongoose'

import { commonSchemaOption } from '../common/transform'

const Schema = mongoose.Schema

const generalSchemaObject = {
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now },
  message: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'TalkMessage' },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' },
  // デフォルトは投稿タイプ毎のスキーマで追記します
  type: {
    type: String,
    required: true }
}

export const talkHistorySchema = new Schema(generalSchemaObject, commonSchemaOption)
export const talkUserHistorySchema = new Schema(Object.assign({
  recipient: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' },
  type: {
    type: String,
    required: false,
    default: 'user' }
}, generalSchemaObject), commonSchemaOption)
export const talkGroupHistorySchema = new Schema(Object.assign({
  group: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'TalkGroup' },
  type: {
    type: String,
    required: false,
    default: 'group' }
}, generalSchemaObject), commonSchemaOption)

const talkHistory = db => db.model('TalkHistory', talkUserHistorySchema, 'TalkHistories')
const talkUserHistory = db => db.model('TalkUserHistory', talkUserHistorySchema, 'TalkHistories')
const talkGroupHistory = db => db.model('TalkGroupHistory', talkGroupHistorySchema, 'TalkHistories')
export { talkHistory, talkUserHistory, talkGroupHistory }
