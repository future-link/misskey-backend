import mongoose from 'mongoose'

import { User } from '../../db'

export default async (ctx, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    ctx.throw(404, 'there are no users has given ID.')
  const user = await User.findById(id)
  if (!user)
    ctx.throw(404, 'there are no users has given ID.')
  ctx.body = user.toObject()
}