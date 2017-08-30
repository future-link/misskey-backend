/**
 * do zero-padding.
 *
 * @param {number} num processing number
 * @param {number} length length after processing
 * @param {showPlusSign} boolean show plus (+) to return string when mejor num specified
 * @return {string}
 */
const zp = (num, length, showPlusSign = false) => {
  if (!Number.isInteger(length) || !Number.isInteger(num)) {
    throw new Error('argument must be integer.')
  }
  const isNegative = num < 0
  const str = Math.abs(num).toString()
  const brevity = length - str.length
  if (brevity <= 0) return num.toString()
  return (isNegative ? '-' : showPlusSign ? '+' : '') + Array(brevity + 1).join('0') + str
}

/**
 * generate time string, similar to "2017/04/16 03:08:02 +0900".
 * @return {string}
 */
export default () => {
  const date = new Date()
  const offsetMinutes = -date.getTimezoneOffset()
  const offsetReminder = offsetMinutes % 60
  const offsetHours = (offsetMinutes - offsetReminder) / 60
  return zp(date.getFullYear(), 2) + '/' +
    zp(date.getMonth() + 1, 2) + '/' +
    zp(date.getDate(), 2) + ' ' +
    zp(date.getHours(), 2) + ':' +
    zp(date.getMinutes(), 2) + ':' +
    zp(date.getSeconds(), 2) + ' ' +
    zp(offsetHours, 2, true) +
    zp(Math.abs(offsetReminder), 2)
}
