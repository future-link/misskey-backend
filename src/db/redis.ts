import * as nodeRedis from 'redis'
const mockRedis = require('redis-js')

import config from '../config'

const redis = config.redis ? nodeRedis : mockRedis

const connector = () => redis.createClient(config.redis) as nodeRedis.RedisClient

export const asyncConnect = new Promise((resolve, reject) => {
  const client = connector()
  client.on('error', e => reject(e))
  client.on('ready', () => resolve(client))
})

export const syncConnect = () => {
  const client = connector()
  client.on('error', e => {
    console.error(e.stack)
    process.exit(1)
  })
}
