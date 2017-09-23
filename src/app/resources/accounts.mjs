import route from 'koa-route'
import mongoose from 'mongoose'

import app from '../app'
import config from '../../config'
import { Account, AccountFollowing, Post, PostLike } from '../../db'

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

// OId: objectId
const getAccountStatusByOId = async oid => {
  return {
    status: {
      counts: {
        posts: await Post.count({user: oid}),
        likes: await PostLike.count({user: oid}),
        followees: await AccountFollowing.count({follower: oid}),
        followers: await AccountFollowing.count({followee: oid})
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
  ctx.body = { accounts: accounts.map(account => account.toObject()) }
}))

app.use(route.get('/accounts/:id', async (ctx, id) => {
  const account = await getAccountById(id)
  if (!account) ctx.throw(404, 'there are no accounts has given ID.')
  ctx.body = { account: account.toObject() }
}))

app.use(route.get('/account', async (ctx) => {
  await denyNonAuthorized(ctx)
  ctx.body = { account: ctx.state.account.toObject() }
}))

app.use(route.get('/accounts/:id/status', async (ctx, id) => {
  const account = await getAccountById(id)
  if (!account) ctx.throw(404, 'there are no accounts has given ID.')
  ctx.body = await getAccountStatusByOId(account.id)
}))

app.use(route.get('/account/status', async (ctx) => {
  await denyNonAuthorized(ctx)
  ctx.body = await getAccountStatusByOId(ctx.state.account.id)
}))

app.use(route.get('/accounts/:id/posts', async (ctx, id) => {
  const [limit, skip] = await getLimitAndSkip(ctx)
  const account = await getAccountById(id)
  if (!account) ctx.throw(404, 'there are no accounts has given ID.')
  const posts = await Post.find({user: account.id}).skip(skip).limit(limit)
  ctx.body = { posts: posts.map(post => post.toObject()) }
}))

app.use(route.get('/account/posts', async (ctx) => {
  const [limit, skip] = await getLimitAndSkip(ctx)
  await denyNonAuthorized(ctx)
  const posts = await Post.find({user: ctx.state.account.id}).skip(skip).limit(limit)
  ctx.body = { posts: posts.map(post => post.toObject()) }
}))

app.use(route.delete('/account/posts/:id', async (ctx, id) => {
  await denyNonAuthorized(ctx)
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const post = await Post.findById(id)
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  if (!post.user.equals(ctx.state.account.id)) ctx.throw(403, `must not try to delete other account's post`)
  await post.remove()
  ctx.status = 204
}))

app.use(route.all('/accounts/:id/posts/(.*)', genSynonymRedirector('/posts')))
app.use(route.all('/account/posts/(.*)', genSynonymRedirector('/posts')))

app.use(route.put('/account/stars/:id', async (ctx, id) => {
  await denyNonAuthorized(ctx)
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const post = await Post.findById(id)
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  const content = {
    post: post.id,
    user: ctx.state.account.id }
  if (await PostLike.findOne(content)) ctx.throw(409, 'already starred.')
  const star = new PostLike(content)
  await star.save()
  ctx.status = 204
}))

app.use(route.delete('/account/stars/:id', async (ctx, id) => {
  await denyNonAuthorized(ctx)
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const post = await Post.findById(id)
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  const star = await PostLike.findOne({
    post: post.id,
    user: ctx.state.account.id })
  if (!star) ctx.throw(404, 'there are no stars to the post has given ID.')
  await star.remove()
  ctx.status = 204
}))

app.use(route.all('/accounts/:id/followees/(.*)', genSynonymRedirector('/accounts')))
app.use(route.all('/account/followees/(.*)', genSynonymRedirector('/accounts')))

app.use(route.all('/accounts/:id/followers/(.*)', genSynonymRedirector('/accounts')))
app.use(route.all('/account/followers/(.*)', genSynonymRedirector('/accounts')))
