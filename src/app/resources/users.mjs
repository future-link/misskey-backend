import route from 'koa-route'
import mongoose from 'mongoose'

import app from '../app'
import { User } from '../../db'

import { denyNonAuthorized } from '../utils'

const getUserById = async id => {
  let user = null
  if (id.startsWith('@')) {
    user = await User.findOne({
      screenNameLower: id.substr(1).toLowerCase()
    })
  } else {
    if (!mongoose.Types.ObjectId.isValid(id)) return null
    user = await User.findById(id)
  }
  return user
}

app.use(route.get('/users/:id', async (ctx, id) => {
  const user = await getUserById(id)
  if (!user) ctx.throw(404, 'there are no users has given ID.')
  ctx.body = { user: user.toObject() }
}))

app.use(route.get('/user', async (ctx) => {
  await denyNonAuthorized(ctx)
  ctx.body = { user: ctx.state.user.toObject() }
}))
