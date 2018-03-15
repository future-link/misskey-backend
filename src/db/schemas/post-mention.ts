import * as mongoose from 'mongoose'
import { IPost } from './post';
import { IUser } from './user';

const Schema = mongoose.Schema

export const schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  cursor: {
    type: Number,
    required: true },
  isRead: {
    type: Boolean,
    required: false,
    default: false },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post' },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
})

export interface IPostMention extends mongoose.Document {
  createdAt: Date
  cursor: number
  isRead: boolean
  post: IPost | mongoose.Types.ObjectId
  user: IUser | mongoose.Types.ObjectId
}

export default (db: mongoose.Connection) => db.model<IPostMention>('PostMention', schema, 'PostMentions')
