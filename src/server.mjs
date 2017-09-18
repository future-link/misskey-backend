import config from './config'
import app from './app'

export default () => { app.listen(config.port) }
