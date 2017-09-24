import route from 'koa-route'
import mongoose from 'mongoose'

import app from '../app'
import config from '../../config'
import { Account, AccountFollowing, Post, PostLike } from '../../db'

import { transformAccount, transformPost } from '../transformers'
import { denyNonAuthorized, getLimitAndSkip } from '../utils'

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

export const getAccountStatusByAccountInstance = account => {
  return {
    status: {
      counts: {
        posts: account.postsCount,
        likes: account.likesCount,
        followees: account.followingCount,
        followers: account.followersCount
      }
    }
  }
}

const genSynonymRedirector = (prefix) => {
  return (function (...rest) {
    const ctx = rest.shift()
    rest.pop() // next
    const path = rest.pop()
    ctx.status = 307
    ctx.set('location', `${config.root}${prefix}/${path}`)
  }).bind({prefix})
}

app.use(route.get('/accounts', async (ctx) => {
  const [limit, skip] = await getLimitAndSkip(ctx)
  const accounts = await Account.find().skip(skip).limit(limit)
  ctx.body = { accounts: await Promise.all(accounts.map(v => transformAccount(v))) }
}))

app.use(route.get('/accounts/:id', async (ctx, id) => {
  const account = await getAccountById(id)
  if (!account) ctx.throw(404, 'there are no accounts has given ID.')
  ctx.body = { account: await transformAccount(account) }
}))

app.use(route.get('/account', async (ctx) => {
  await denyNonAuthorized(ctx)
  ctx.body = { account: await transformAccount(ctx.state.account) }
}))

app.use(route.get('/accounts/:id/status', async (ctx, id) => {
  const account = await getAccountById(id)
  if (!account) ctx.throw(404, 'there are no accounts has given ID.')
  ctx.body = getAccountStatusByAccountInstance(account)
}))

app.use(route.get('/account/status', async (ctx) => {
  await denyNonAuthorized(ctx)
  ctx.body = getAccountStatusByAccountInstance(ctx.state.account)
}))

app.use(route.get('/accounts/:id/posts', async (ctx, id) => {
  const [limit, skip] = await getLimitAndSkip(ctx)
  const account = await getAccountById(id)
  if (!account) ctx.throw(404, 'there are no accounts has given ID.')
  const posts = await Post.find({user: account.id}).skip(skip).limit(limit)
  ctx.body = { posts: await Promise.all(posts.map(v => transformPost(v))) }
}))

app.use(route.get('/account/posts', async (ctx) => {
  const [limit, skip] = await getLimitAndSkip(ctx)
  await denyNonAuthorized(ctx)
  const posts = await Post.find({user: ctx.state.account.id}).skip(skip).limit(limit)
  ctx.body = { posts: await Promise.all(posts.map(v => transformPost(v))) }
}))

app.use(route.delete('/account/posts/:id', async (ctx, id) => {
  await denyNonAuthorized(ctx)

  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const post = await Post.findById(id)
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  if (!post.user.equals(ctx.state.account.id)) ctx.throw(403, `must not try to delete other account's post`)

  --ctx.state.account.postCount

  await Promise.all([post.remove(), ctx.state.account.save()])

  ctx.status = 204
}))

app.use(route.all('/accounts/:id/posts/(.*)', genSynonymRedirector('/posts')))
app.use(route.all('/account/posts/(.*)', genSynonymRedirector('/posts')))

app.use(route.put('/account/stars/:id', async (ctx, id) => {
  await denyNonAuthorized(ctx)

  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const content = {
    post: id,
    user: ctx.state.account.id }
  const [post, starState] = await Promise.all([Post.findById(id), PostLike.findOne(content)])
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  if (starState) ctx.throw(409, 'already starred.')

  const star = new PostLike(content)
  ++post.likesCount

  await Promise.all([star.save(), post.save()])

  ctx.status = 204
}))

app.use(route.delete('/account/stars/:id', async (ctx, id) => {
  await denyNonAuthorized(ctx)

  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const [post, star] = await Promise.all([Post.findById(id), PostLike.findOne({
    post: id,
    user: ctx.state.account.id })])
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  if (!star) ctx.throw(404, 'there are no stars to the post has given ID.')

  --post.likesCount

  await Promise.all([star.remove(), post.save()])

  ctx.status = 204
}))

app.use(route.all('/accounts/:id/followees/(.*)', genSynonymRedirector('/accounts')))
app.use(route.all('/account/followees/(.*)', genSynonymRedirector('/accounts')))

app.use(route.all('/accounts/:id/followers/(.*)', genSynonymRedirector('/accounts')))
app.use(route.all('/account/followers/(.*)', genSynonymRedirector('/accounts')))
