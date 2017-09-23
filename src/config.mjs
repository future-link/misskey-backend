import dotenv from 'dotenv-safe'

function validator (config) {
  const errors = []
  if (!config.root) errors.push('[BACKEND_URI_ROOT] must set URI root.')
  if (!config.mongodb) errors.push('[BACKEND_MONGODB_URI] must set MongoDB URI.')
  if (!config.port) errors.push('[BACKEND_PORT] must set application standby port.')
  if (config.flags.clustering && !config.redis) errors.push('[BACKEND_REDIS_URI] must set Redis URI with clustering mode.')
  return errors
}

dotenv.load({
  allowEmptyValues: true
})

const config = {
  mongodb: process.env.BACKEND_MONGODB_URI,
  redis: process.env.BACKEND_REDIS_URI || null,
  flags: {
    clustering: process.argv.indexOf('--clustering') !== -1,
    verbose: process.argv.indexOf('--verbose') !== -1
  },
  port: Number.parseInt(process.env.BACKEND_PORT),
  root: process.env.BACKEND_URI_ROOT
}

const errors = validator(config)
if (errors.length > 0) throw new Error(`'${errors.join(`', '`)}'`)

export default config
