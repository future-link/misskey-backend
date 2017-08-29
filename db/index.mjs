import mongoose from 'mongoose'
import mongooseAutoIncrement from 'mongoose-auto-increment'

import config from '../config'

const db = mongoose.createConnection(config.mongodb.uri, {
    promiseLibrary: global.Promise
})
mongooseAutoIncrement.initialize(db)

import albumTag from './schemas/album-tag'
const albumTagModel = albumTag(db)
import albumFolder from './schemas/album-folder'
const albumFolderModel = albumFolder(db)
import albumFile from './schemas/album-file'
const albumFileModel = albumFile(db)
import application from './schemas/application'
const applicationModel = albumFile(db)
import notification from './schemas/notification'
const notificationModel = notification(db)
import postLike from './schemas/post-like'
const postLikeModel = postLike.default(db)
import postMention from './schemas/post-mention'
const postMentionModel = postMention.default(db)
import { post, status, repost, reply } from './schemas/post'
const postModel = post(db)
const statusModel = status(db)
const repostModel = repost(db)
const replyModel = reply(db)
import talkGroupInvitation from './schemas/talk-group-invitation'
const talkGroupInvitationModel = talkGroupInvitation(db)
import talkGroup from './schemas/talk-group'
const talkGroupModel = talkGroup(db)
import { talkHistory, talkUserHistory, talkGroupHistory } from './schemas/talk-history')
const talkHistoryModel = talkHistory(db)
const talkUserHistoryModel = talkUserHistory(db)
const talkGroupHistoryModel = talkGroupHistory(db)
import userFollowing from './schemas/user-following'
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
    userFollowingModel as userFollowing
}
