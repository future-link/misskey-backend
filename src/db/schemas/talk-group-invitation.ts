import * as mongoose from 'mongoose'
import { IUser } from './user';
import { ITalkGroup } from './talk-group';

const Schema = mongoose.Schema

export const schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  group: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'TalkGroup' },
  isDeclined: {
    type: Boolean,
    required: false,
    default: false },
  text: {
    type: String,
    required: false,
    default: null },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
})

export interface ITalkGroupInvitation extends mongoose.Document{
  createdAt: Date
  group: ITalkGroup | mongoose.Types.ObjectId
  isDeclined: boolean
  text: string
  user: IUser | mongoose.Types.ObjectId
}

export default (db: mongoose.Connection) => db.model<ITalkGroupInvitation>('TalkGroupInvitation', schema, 'TalkGroupInvitations')
