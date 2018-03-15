import * as dotenv from 'dotenv-safe'

function validator (config: {
  mongodb?: string
  redis: string | null
  flags: {
    clustering: boolean
    verbose: boolean
  }
  port: number
}) {
  const errors = []
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
  port: Number.parseInt(process.env.BACKEND_PORT || "0")
}

const errors = validator(config)
if (errors.length > 0) throw new Error(`'${errors.join(`', '`)}'`)


interface ConfigBase {
  mongodb: string
  port: number
  flags: {
    verbose: boolean
  }
}

interface ConfigNotClustering extends ConfigBase {
  flags: {
    verbose: boolean
    clustering: false
  }
  redis: string | null
}

interface ConfigClustering extends ConfigBase {
  flags: {
    verbose: boolean
    clustering: true
  }
  redis: string
}

type Config = ConfigClustering | ConfigNotClustering

export default config as Config

