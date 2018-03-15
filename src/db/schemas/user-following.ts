import * as mongoose from 'mongoose'
import * as mongooseAutoIncrement from 'mongoose-auto-increment'
import { IUser } from './user';

const Schema = mongoose.Schema

export const schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  cursor: {
    type: Number },
  followee: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' },
  follower: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
})

export interface IUserFollowing extends mongoose.Document {
  createdAt: Date
  cursor: number
  followee: IUser | mongoose.Types.ObjectId
  follower: IUser | mongoose.Types.ObjectId
}

export default (db: mongoose.Connection) => {
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'UserFollowing',
    field: 'cursor'
  })
  return db.model<IUserFollowing>('UserFollowing', schema, 'UserFollowings')
}
