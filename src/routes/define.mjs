import path from 'path'

// load handlers
import * as handlers from '../handlers'

export default {
  get: [
    {
      path: '/',
      handler: handlers.status
    }
  ]
}
