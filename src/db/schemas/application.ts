import * as mongoose from 'mongoose'

const Schema = mongoose.Schema

export const schema = new Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  userId: {
    type: Schema.Types.ObjectId,
    required: true },
  appKey: {
    type: String,
    required: true },
  callbackUrl: {
    type: String,
    required: false,
    default: null },
  description: {
    type: String,
    required: true },
  iconId: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null },
  permissions: {
    type: [String],
    required: true },
  isSuspended: {
    type: Boolean,
    required: false,
    default: false },
  idDeleted: {
    type: Boolean,
    required: false,
    default: false }
})

export interface IApplication extends mongoose.Document{
  createdAt: Date
  userId: mongoose.Types.ObjectId
  appKey: string
  callbackUrl?: string
  description: string
  iconId?: mongoose.Types.ObjectId
  permissions: string[]
  isSuspended: boolean
  isDeleted: boolean | any
}

export default (db: mongoose.Connection) => db.model<IApplication>('Application', schema, 'Applications')
