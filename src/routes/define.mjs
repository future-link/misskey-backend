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
      handler: handlers.posts.getById
    },
    {
      path: '/media/:id',
      handler: handlers.media.getById
    },
    {
      path: '/users/@:screenname',
      handler: handlers.users.getByScreenname
    },
    {
      path: '/users/:id',
      handler: handlers.users.getById
    }
  ]
}
