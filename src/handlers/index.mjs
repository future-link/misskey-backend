import hash from '../tools/git-hash'

export const status = (ctx) => {
  ctx.body = {
    hash
  }
}
