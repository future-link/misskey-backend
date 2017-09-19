import route from 'koa-route'
import mongoose from 'mongoose'

import app from '../app'
import { User } from '../../db'

import { denyNonAuthorized } from '../utils'

app.use(route.get('/users/@:screenname', async (ctx, screenname) => {
  const user = await User.findOne({
    screenNameLower: screenname.toLowerCase()
  })
  if (!user) ctx.throw(404, 'there are no users has given screenname.')
  ctx.body = { user: user.toObject() }
}))

app.use(route.get('/users/:id', async (ctx, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no users has given ID.')
  const user = await User.findById(id)
  if (!user) ctx.throw(404, 'there are no users has given ID.')
  ctx.body = { user: user.toObject() }
}))

app.use(route.get('/user', async (ctx) => {
  await denyNonAuthorized(ctx)
  ctx.body = { user: ctx.state.user.toObject() }
}))
