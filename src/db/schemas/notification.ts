import * as mongoose from 'mongoose'
import * as mongooseAutoIncrement from 'mongoose-auto-increment'
import { IApplication } from './application';
import { IUser } from './user';

const Schema = mongoose.Schema

export const schema = new Schema({
  app: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'Application' },
  content: {
    type: Schema.Types.Mixed,
    required: false,
    default: {} },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  cursor: {
    type: Number },
  isRead: {
    type: Boolean,
    required: false,
    default: false },
  type: {
    type: String,
    required: true },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' }
})

export interface INotification extends mongoose.Document{
  app?: IApplication | mongoose.Types.ObjectId
  content: any
  createdAt: Date
  cursor: number
  isRead: boolean
  type: string
  user: IUser | mongoose.Types.ObjectId
}

export default (db: mongoose.Connection) => {
  schema.plugin(mongooseAutoIncrement.plugin, {
    model: 'Notification',
    field: 'cursor'
  })
  return db.model<INotification>('Notification', schema, 'Notifications')
}
