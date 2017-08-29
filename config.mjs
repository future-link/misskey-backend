import dotenv from 'dotenv-safe'

dotenv.load()

export default {
    mongodb: {
        uri: process.env.MONGODB_URI
    }
}
