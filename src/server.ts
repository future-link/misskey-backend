import http from 'http'

import koa from './koa'
import ws from './ws'

const server = http.createServer()
server.on('request', koa.callback())
ws({ server })

export default server
