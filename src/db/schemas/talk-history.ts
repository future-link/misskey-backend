import * as mongoose from 'mongoose'
import { IUser } from './user';
import { ITalkGroup } from './talk-group';

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

export const talkHistorySchema = new Schema(generalSchemaObject)
export const talkUserHistorySchema = new Schema(Object.assign({
  recipient: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' },
  type: {
    type: String,
    required: false,
    default: 'user' }
}, generalSchemaObject))
export const talkGroupHistorySchema = new Schema(Object.assign({
  group: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'TalkGroup' },
  type: {
    type: String,
    required: false,
    default: 'group' }
}, generalSchemaObject))

export interface ITalkHistory extends mongoose.Document {
  updatedAt: Date
  // TODO: TalkMessageのschemaを追加
  // message: ITalkMessage | mongoose.Types.ObjectId
  user: IUser | mongoose.Types.ObjectId
  type: string
}

export interface ITalkUserHistory extends mongoose.Document {
  recipient: IUser | mongoose.Types.ObjectId
  type: "user"
}

export interface ITalkGroupHistory extends mongoose.Document {
  group: ITalkGroup | mongoose.Types.ObjectId
  type: "group"
}

const talkHistory = (db: mongoose.Connection) => db.model<ITalkHistory>('TalkHistory', talkUserHistorySchema, 'TalkHistories')
const talkUserHistory = (db: mongoose.Connection) => db.model<ITalkUserHistory>('TalkUserHistory', talkUserHistorySchema, 'TalkHistories')
const talkGroupHistory = (db: mongoose.Connection) => db.model<ITalkGroupHistory>('TalkGroupHistory', talkGroupHistorySchema, 'TalkHistories')
export { talkHistory, talkUserHistory, talkGroupHistory }
