import mongooseAutoIncrement from 'mongoose-auto-increment'

export default db => {
    mongooseAutoIncrement.initialize(db)
    return {
        albumFile: require('./schemas/album-file')(db),
        albumFolder: require('./schemas/album-folder')(db),
        albumTag: require('./schemas/album-tag')(db),
        application: require('./schemas/application')(db),
        notification: require('./schemas/notification')(db),
        postLike: require('./schemas/post-like')(db),
        postMention: require('./schemas/post-mention')(db),
        post: require('./schemas/post').post(db),
        status: require('./schemas/post').status(db),
        repost: require('./schemas/post').repost(db),
        reply: require('./schemas/post').reply(db)
    }
}
