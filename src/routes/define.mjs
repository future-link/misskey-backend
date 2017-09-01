import path from 'path'

// load handlers
import * as indexHandler from '../handlers/index'

export default {
  get: [
    {
      path: '/',
      handler: indexHandler.hoi
    }
  ]
}
