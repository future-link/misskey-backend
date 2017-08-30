import dotenv from 'dotenv-safe'
import path from 'path'

dotenv.load({
    path: path.resolve('..')
})

export default {
    mongodb: {
        uri: process.env.MONGODB_URI
    }
}
