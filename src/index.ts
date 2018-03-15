import cluster from 'cluster'
import os from 'os'

import config from './config'

import Logger from './tools/logger'

import server from './server'

const logger = new Logger(cluster.isMaster ? 'master' : 'worker')

/**
 * signature
 */
if (cluster.isMaster) {
  console.log('> misskey backend provider')
  console.log('> https://github.com/future-link/misskey-backend')
  console.log(`> server will listen on port ${config.port}` + '\n')
}

/**
 * fork every cpu cores if clustering option enabled.
 */
if (cluster.isMaster && config.flags.clustering) {
  // cpu cores counter
  const cpuCores = os.cpus().length

  // worker exited, notice to console & re-fork.
  cluster.on('exit', (worker) => {
    logger.log(`worker number ${worker.id} is down.`)
    cluster.fork()
  })

  // worker in prepare time, notice to console.
  cluster.on('online', (worker) => {
    logger.log(`worker number ${worker.id} is online.`)
  })

  // fork workers each cpu cores.
  for (let i = 0; i < cpuCores; i++) {
    cluster.fork()
  }
} else {
  server.listen(config.port)
  // notice worker number in worker
  if (cluster.isWorker) logger.log(`worker number ${cluster.worker.id} is ready.`)
}
