import mongooseAutoIncrement from 'mongoose-auto-increment'

export default db => {
    mongooseAutoIncrement.initialize(db)
    return {
        albumTag: require('./schemas/album-tag').default(db),
        albumFolder: require('./schemas/album-folder').default(db),
        albumFile: require('./schemas/album-file').default(db),
        application: require('./schemas/application').default(db),
        notification: require('./schemas/notification').default(db),
        postLike: require('./schemas/post-like').default(db),
        postMention: require('./schemas/post-mention').default(db),
        post: require('./schemas/post').post(db),
        status: require('./schemas/post').status(db),
        repost: require('./schemas/post').repost(db),
        reply: require('./schemas/post').reply(db),
        talkGroupInvitation: require('./schemas/talk-group-invitation').default(db),
        talkGroup: require('./schemas/talk-group').default(db),
        talkHistory: require('./schemas/talk-history').talkHistory(db),
        talkUserHistory: require('./schemas/talk-history').talkUserHistory(db),
        talkGroupHistory: require('./schemas/talk-history').talkGroupHistory(db),
        userFollowing: require('./schemas/user-following').default(db)
    }
}
