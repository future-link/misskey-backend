import path from 'path'

// load handlers
import * as handlers from '../handlers'

export default {
  get: [
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
    }
  ]
}
