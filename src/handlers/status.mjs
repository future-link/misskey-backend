import hash from '../tools/git-hash'

export default (ctx) => {
  ctx.body = {
    hash
  }
}
