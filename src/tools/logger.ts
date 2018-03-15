import util from 'util'

import time from './time'
import config from '../config'

/**
 * output object or string to console with 4 space padding.
 * @param {string|object} indicator output this to console
 * @param {string} level console level
 */
const showPadded = (indicator, level) => {
  const fourSpace = '    '
  const clams = typeof indicator === 'object' ? util.inspect(indicator) : indicator
  const shell = clams.split(/\r?\n/)
  console[level](fourSpace + shell.join('\n' + fourSpace))
}

export default class Logger {
  constructor (name) {
    this.verbose = config.flags.verbose
    this.name = name
  }

  /**
   * output to console with time.
   * @param {string} str output this to console
   */
  log (str) {
    console.log(`[${time()}] ${this.name} | ${str}`)
  }

  /**
   * output to console when verbose flag setted
   * with 4 space padding.
   * @param {string|object} indicator output this to console
   */
  detail (indicator) {
    if (!this.verbose) return
    showPadded(indicator, 'log')
  }

  /**
   * output error to console with 4 space padding.
   * @param {string|object} indicator output this to console
   */
  error (indicator) {
    showPadded(indicator, 'error')
  }
}
