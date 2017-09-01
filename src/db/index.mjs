import mongoose from 'mongoose'
import mongooseAutoIncrement from 'mongoose-auto-increment'

import config from '../config'

import albumTag from './schemas/album-tag'
import albumFolder from './schemas/album-folder'
import albumFile from './schemas/album-file'
import application from './schemas/application'
import notification from './schemas/notification'
import postLike from './schemas/post-like'
import postMention from './schemas/post-mention'
import { post, status, repost, reply } from './schemas/post'
import talkGroupInvitation from './schemas/talk-group-invitation'
import { talkHistory, talkUserHistory, talkGroupHistory } from './schemas/talk-history'
import talkGroup from './schemas/talk-group'
import user from './schemas/user'
import userFollowing from './schemas/user-following'

mongoose.Promise = global.Promise
const db = mongoose.createConnection(config.mongodb.uri, {
  promiseLibrary: global.Promise
})
mongooseAutoIncrement.initialize(db)

const AlbumTag = albumTag(db)
const AlbumFolder = albumFolder(db)
const AlbumFile = albumFile(db)
const Application = application(db)
const Notification = notification(db)
const PostLike = postLike(db)
const PostMention = postMention(db)
const Post = post(db)
const Status = status(db)
const Repost = repost(db)
const Reply = reply(db)
const TalkGroupInvitation = talkGroupInvitation(db)
const TalkGroup = talkGroup(db)
const TalkHistory = talkHistory(db)
const TalkUserHistory = talkUserHistory(db)
const TalkGroupHistory = talkGroupHistory(db)
const User = user(db)
const UserFollowing = userFollowing(db)

export {
  AlbumTag,
  AlbumFolder,
  AlbumFile,
  Application,
  Notification,
  PostLike,
  PostMention,
  Post,
  Status,
  Repost,
  Reply,
  TalkGroupInvitation,
  TalkGroup,
  TalkHistory,
  TalkUserHistory,
  TalkGroupHistory,
  User,
  UserFollowing
}
