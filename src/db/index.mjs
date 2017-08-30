import mongoose from 'mongoose'

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

const albumTagModel = albumTag(db)
const albumFolderModel = albumFolder(db)
const albumFileModel = albumFile(db)
const applicationModel = application(db)
const notificationModel = notification(db)
const postLikeModel = postLike(db)
const postMentionModel = postMention(db)
const postModel = post(db)
const statusModel = status(db)
const repostModel = repost(db)
const replyModel = reply(db)
const talkGroupInvitationModel = talkGroupInvitation(db)
const talkGroupModel = talkGroup(db)
const talkHistoryModel = talkHistory(db)
const talkUserHistoryModel = talkUserHistory(db)
const talkGroupHistoryModel = talkGroupHistory(db)
const userModel = user(db)
const userFollowingModel = userFollowing(db)

export {
  albumTagModel as AlbumTag,
  albumFolderModel as albumFolder,
  albumFileModel as albumFile,
  applicationModel as application,
  notificationModel as notification,
  postLikeModel as postLike,
  postMentionModel as postMention,
  postModel as post,
  statusModel as status,
  repostModel as repost,
  replyModel as reply,
  talkGroupInvitationModel as talkGroupInvitation,
  talkGroupModel as talkGroup,
  talkHistoryModel as talkHistory,
  talkUserHistoryModel as talkUserHistory,
  talkGroupHistoryModel as talkGroupHistory,
  userModel as user,
  userFollowingModel as userFollowing
}
