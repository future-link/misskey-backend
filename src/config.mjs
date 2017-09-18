import dotenv from 'dotenv-safe'

dotenv.load()

export default {
  mongodb: {
    uri: process.env.MONGODB_URI
  },
  flags: {
    clustering: process.argv.indexOf('--clustering') !== -1,
    verbose: process.argv.indexOf('--verbose') !== -1
  },
  port: Number.parseInt(process.env.BACKEND_PORT)
}
