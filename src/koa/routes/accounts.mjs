import Router from 'koa-router'
import mongoose from 'mongoose'

import config from '../../config'
import { Account, AccountFollowing, Post, PostLike, Status } from '../../db/mongodb'

import { transformAccount, transformPost } from '../../transformers'
import { denyNonAuthorized, validateAndCastLimitAndSkip } from '../middlewares'

const accountsRouter = new Router()
const accountRouter = new Router()

const getAccountById = async id => {
  let account = null
  if (id.startsWith('@')) {
    account = await Account.findOne({
      screenNameLower: id.substr(1).toLowerCase()
    })
  } else {
    if (!mongoose.Types.ObjectId.isValid(id)) return null
    account = await Account.findById(id)
  }
  return account
}

const getAccountStatusByAccountInstance = async account => {
  return {
    status: {
      counts: {
        posts: account.postsCount,
        stars: account.likesCount,
        followees: account.followingCount,
        followers: account.followersCount
      }
    }
  }
}

accountsRouter.get('/', validateAndCastLimitAndSkip(), async ctx => {
  const { limit, skip } = ctx.state.query
  const accounts = await Account.find().skip(skip).limit(limit)
  ctx.body = { accounts: await Promise.all(accounts.map(v => transformAccount(v))) }
})

accountsRouter.get('/:id', async ctx => {
  const { id } = ctx.params
  const account = await getAccountById(id)
  if (!account) ctx.throw(404, 'there are no accounts has given ID.')
  ctx.body = { account: await transformAccount(account) }
})

accountRouter.get('/', denyNonAuthorized, async ctx => {
  ctx.body = { account: await transformAccount(ctx.state.account) }
})

accountsRouter.get('/:id/status', async ctx => {
  const { id } = ctx.params
  const account = await getAccountById(id)
  if (!account) ctx.throw(404, 'there are no accounts has given ID.')
  ctx.body = await getAccountStatusByAccountInstance(account)
})

accountRouter.get('/status', denyNonAuthorized, async ctx => {
  ctx.body = await getAccountStatusByAccountInstance(ctx.state.account)
})

accountsRouter.get('/:id/posts', validateAndCastLimitAndSkip(), async ctx => {
  const { id } = ctx.params
  const { limit, skip } = ctx.state.query
  const account = await getAccountById(id)
  if (!account) ctx.throw(404, 'there are no accounts has given ID.')
  const posts = await Post.find({user: account.id}).ne('type', 'repost').skip(skip).limit(limit)
  ctx.body = { posts: await Promise.all(posts.map(v => transformPost(v))) }
})

accountRouter.get('/posts', denyNonAuthorized, validateAndCastLimitAndSkip(), async ctx => {
  const { limit, skip } = ctx.state.query
  const posts = await Post.find({user: ctx.state.account.id}).ne('type', 'repost').skip(skip).limit(limit)
  ctx.body = { posts: await Promise.all(posts.map(v => transformPost(v))) }
})

accountRouter.delete('/posts/:id', denyNonAuthorized, async ctx => {
  const { id } = ctx.params

  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const post = await Post.findById(id)
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  if (['repost'].includes(post.type)) ctx.throw(404, 'there are no posts has given ID.')
  if (!post.user.equals(ctx.state.account.id)) ctx.throw(403, `must not try to delete other account's post`)

  --ctx.state.account.postCount

  await Promise.all([post.remove(), ctx.state.account.save()])

  ctx.status = 204
})

accountRouter.put('/stars/:id', denyNonAuthorized, async ctx => {
  const { id } = ctx.params

  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const content = {
    post: id,
    user: ctx.state.account.id }
  const [post, starState] = await Promise.all([Status.findById(id).populate('user'), PostLike.findOne(content)])
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  if (['repost'].includes(post.type)) ctx.throw(404, 'there are no posts has given ID.')
  if (starState) ctx.throw(409, 'already starred.')

  const star = new PostLike(content)
  ++post.likesCount
  ++post.user.likedCount

  await Promise.all([star.save(), post.save(), post.user.save()])

  ctx.status = 204
})

accountRouter.delete('/stars/:id', denyNonAuthorized, async ctx => {
  const { id } = ctx.params

  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const [post, star] = await Promise.all([Status.findById(id).populate('user'), PostLike.findOne({
    post: id,
    user: ctx.state.account.id })])
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  if (['repost'].includes(post.type)) ctx.throw(404, 'there are no posts has given ID.')
  if (!star) ctx.throw(404, 'there are no stars to the post has given ID.')

  --post.likesCount
  --post.user.likedCount

  await Promise.all([star.remove(), post.save(), post.user.save()])

  ctx.status = 204
})

// set-up redirects
const genSynonymRedirector = prefix => {
  return ctx => {
    const path = ctx.params['0']
    const suffix = ctx.state.format ? `.${ctx.state.format}` : ''
    ctx.status = 307
    ctx.set('location', `${config.root}${prefix}/${path}${suffix}`)
  }
}
accountsRouter.all('/:id/posts/(.*)', genSynonymRedirector('/posts'))
accountRouter.all('/posts/(.*)', genSynonymRedirector('/posts'))
accountsRouter.all('/:id/followees/(.*)', genSynonymRedirector('/accounts'))
accountRouter.all('/followees/(.*)', genSynonymRedirector('/accounts'))
accountsRouter.all('/:id/followers/(.*)', genSynonymRedirector('/accounts'))
accountRouter.all('/followers/(.*)', genSynonymRedirector('/accounts'))

export {
  accountsRouter as accounts,
  accountRouter as account
}
