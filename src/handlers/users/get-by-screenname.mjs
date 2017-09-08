import mongoose from 'mongoose'

import { User } from '../../db'

export default async (ctx, screenname) => {
  const user = await User.findOne({
    screenNameLower: screenname.toLowerCase()
  })
  if (!user)
    ctx.throw(404, 'there are no users has given screenname.')
  ctx.body = user.toObject()
}
