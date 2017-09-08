import mongoose from 'mongoose'

import { PostLike } from '../../db'

export default async (ctx, id) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    ctx.throw(404, 'there are no stargazers to the post has given ID.')
  const likes = await PostLike.find({
    post: id
  }).select({
    user: 1
  }).populate('user')
  if (!likes)
    ctx.throw(404, 'there are no stargazers to the post has given ID.')
  ctx.body = []
  likes.forEach(like => { ctx.body.push(like.user.toObject()) })
}
