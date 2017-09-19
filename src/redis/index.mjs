import redis from 'redis'
import mockRedis from 'redis-js'

import config from '../config'

const client = (config.redis ? redis : mockRedis).createClient(config.redis)
client.on('error', e => { throw e })

export default client
