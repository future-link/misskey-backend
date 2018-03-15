import fs from 'fs'
import path from 'path'

const git = path.resolve('.git')
const head = fs.readFileSync(path.join(git, 'HEAD')).toString().trim()

let hash

if (head.startsWith('ref: ')) {
  const ref = head.slice(5)
  hash = fs.readFileSync(path.join(git, ref)).toString().trim()
} else if (head.length === 40) {
  hash = head
} else {
  throw new Error(`unknown HEAD content: "${head}"`)
}

export default hash
