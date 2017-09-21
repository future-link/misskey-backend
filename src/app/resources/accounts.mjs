import route from 'koa-route'
import mongoose from 'mongoose'

import app from '../app'
import { Account, AccountFollowing, PostLike } from '../../db'

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

app.use(route.get('/accounts/:id/status', async (ctx, id) => {
  let uoid
  if (id.startsWith('@')) {
    const account = await getAccountById(id)
    if (!account) ctx.throw(404, 'there are no accounts has given ID.')
    uoid = account.id
  } else {
    if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no accounts has given ID.')
    uoid = id
  }
  ctx.body = {
    status: {
      counts: {
        posts: await Post.count({user: uoid}),
        likes: await PostLike.count({user: uoid}),
        followees: await UserFollowing.count({follower: uoid}),
        followers: await UserFollowing.count({followee: uoid})
      }
    }
  }
}))

app.use(route.get('/account', async (ctx) => {
  await denyNonAuthorized(ctx)
  ctx.body = { account: ctx.state.account.toObject() }
}))
