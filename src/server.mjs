import http from 'http'

import koaApp from './koa-app'
import wsApp from './ws-app'

const server = http.createServer()
server.on('request', koaApp.callback())
wsApp({ server })

export default server
