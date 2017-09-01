import mongoose from 'mongoose'

import { Post } from '../../db'

export default async (ctx, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    ctx.throw(404, 'there are no posts has given ID.')
  const post = await Post.findById(id)
  if (!post)
    ctx.throw(404, 'there are no posts has given ID.')
  ctx.body = post.toObject()
}
