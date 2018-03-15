import * as mongoose from 'mongoose'
import { IAlbumFile } from './album-file';
import { IPost } from './post';

const Schema = mongoose.Schema

export const schema = new Schema({
  avatar: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'AlbumFile' },
  avatarPath: {
    type: String,
    required: false,
    default: null },
  banner: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'AlbumFile' },
  bannerPath: {
    type: String,
    required: false,
    default: null },
  birthday: {
    type: Date,
    required: false,
    default: null },
  color: {
    type: String,
    required: false,
    default: null },
  comment: {
    type: String,
    required: false,
    default: null },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now },
  credit: {
    type: Number,
    required: true },
  description: {
    type: String,
    required: false,
    default: null },
  email: {
    type: String,
    required: false,
    sparse: true,
    default: null },
  encryptedPassword: {
    type: String,
    required: true },
  followersCount: {
    type: Number,
    required: false,
    default: 0 },
  followingCount: {
    type: Number,
    required: false,
    default: 0 },
  isDeleted: {
    type: Boolean,
    required: false,
    default: false },
  isEmailVerified: {
    type: Boolean,
    required: false,
    default: false },
  isPrivate: {
    type: Boolean,
    required: false,
    default: false },
  isPro: {
    type: Boolean,
    required: false,
    default: false },
  isStaff: {
    type: Boolean,
    required: false,
    default: false },
  isSuspended: {
    type: Boolean,
    required: false,
    default: false },
  isVerified: {
    type: Boolean,
    required: false,
    default: false },
  lang: {
    type: String,
    required: true },
  latestPost: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null },
  likedCount: {
    type: Number,
    required: false,
    default: 0 },
  likesCount: {
    type: Number,
    required: false,
    default: 0 },
  location: {
    type: String,
    required: false,
    default: null },
  name: {
    type: String,
    required: true },
  pinnedPost: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'Post' },
  postsCount: {
    type: Number,
    required: false,
    default: 0 },
  screenName: {
    type: String,
    required: true,
    unique: true },
  screenNameLower: {
    type: String,
    required: true,
    unique: true,
    lowercase: true },
  tags: {
    type: [String],
    required: false,
    default: [] },
  timelineReadCursor: {
    type: Number,
    required: false,
    default: 0 },
  url: {
    type: String,
    required: false,
    default: null },
  wallpaper: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null,
    ref: 'AlbumFile' },
  wallpaperPath: {
    type: String,
    required: false,
    default: null }
})

export interface IUser extends mongoose.Document {
  avatar?: IAlbumFile | mongoose.Types.ObjectId
  avatarPath?: string
  banner?: IAlbumFile | mongoose.Types.ObjectId
  bannerPath?: string
  birthday?: Date
  color?: string
  createdAt: Date
  credit: number
  description?: string
  email?: string
  encryptedPassword: string
  followersCount: number
  followingCount: number
  isDeleted: boolean | any
  isEmailVerified: boolean
  isPrivate: boolean
  isPro: boolean
  isStaff: boolean
  isSuspended: boolean
  isVerified: boolean
  lang: string
  latestPost?: IPost | mongoose.Types.ObjectId
  likedCount: number
  likesCount: number
  location?: string
  name: string
  pinnedPost?: IPost | mongoose.Types.ObjectId
  postsCount: number
  screenName: string
  screenNameLower: string
  tags: string[]
  timelineReadCursor: number
  url?: string
  wallpaper: IAlbumFile | mongoose.Types.ObjectId
  wallpaperPath?: string
}

export default (db: mongoose.Connection) => db.model<IUser>('User', schema, 'Users')
