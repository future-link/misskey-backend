import path from 'path'

const route = path.join(__dirname, '..', 'handlers')

export default {
  get: [
    {
      path: '/',
      handler: require(path.join(route, 'index'))
    }
  ]
}
