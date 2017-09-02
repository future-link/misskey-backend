import path from 'path'

// load handlers
import * as handlers from '../handlers'

export default {
  get: [
    // 認証不要
    {
      path: '/',
      handler: handlers.status
    },
    {
      path: '/posts/:id',
      handler: handlers.posts.findById
    },
    {
      path: '/media/:id',
      handler: handlers.media.findById
    },
    {
      path: '/users/@:screenname',
      handler: handlers.users.findByScreenname
    },
    {
      path: '/users/:id',
      handler: handlers.users.findById
    }
  ]
}
