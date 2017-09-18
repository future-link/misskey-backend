import route from 'koa-route'
import mongoose from 'mongoose'

import app from '../app'
import { Post, PostLike } from '../../db'

app.use(route.get('/posts/:id', async (ctx, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) { ctx.throw(404, 'there are no posts has given ID.') }
  const post = await Post.findById(id)
  if (!post) { ctx.throw(404, 'there are no posts has given ID.') }
  ctx.body = { post: post.toObject() }
}))

app.use(route.get('/posts/:id/stargazers', async (ctx, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) { ctx.throw(404, 'there are no stargazers to the post has given ID.') }
  const likes = await PostLike.find({
    post: id
  }).select({
    user: 1
  }).populate('user')
  if (!likes) { ctx.throw(404, 'there are no stargazers to the post has given ID.') }
  const stargazers = []
  likes.forEach(like => { ctx.body.push(like.user.toObject()) })
  ctx.body = { stargazers }
}))
