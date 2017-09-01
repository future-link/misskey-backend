import mongoose from 'mongoose'

import { post } from '../../db'

export default async (ctx, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(400, 'bad ID')
  const content = await post.findById(id)
  if (!content) ctx.throw(404, 'there are no posts has given ID.')
  ctx.body = content.toObject()
}
