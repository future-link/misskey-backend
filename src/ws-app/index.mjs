import ws from 'ws'

import Route from './route'

process.on('warning', (warning) => {
  console.warn(warning.message);
  // Warning: Possible EventEmitter memory leak detected. 2 test listeners added. Use emitter.setMaxListeners() to increase limit
});

export default (...rest) => {
  const server = new ws.Server(...rest)
  const route = new Route(server)
  route.use('connection', async (...rest) => {
    const next = rest.pop()
    await next()
    const ws = rest.shift()
    ws.send('bye!')
    ws.close()
  })
  route.use('connection', '/:nanka', async (ws, incomming, nanka, next) => {
    ws.send('!!!' + nanka)
    await next()
  })
  route.use('connection', (ws) => ws.send('hi2!'))
  return server
}
