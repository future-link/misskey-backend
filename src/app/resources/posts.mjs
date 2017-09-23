import route from 'koa-route'
import mongoose from 'mongoose'

import app from '../app'
import { Post, PostLike } from '../../db'

import { getLimitAndSkip, denyNonAuthorized } from '../utils'
import redis from '../../redis'

app.use(route.get('/posts', async (ctx) => {
  const [limit, skip] = await getLimitAndSkip(ctx)
  const posts = await Post.find().skip(skip).limit(limit)
  ctx.body = { posts: posts.map(post => post.toObject()) }
}))

app.use(route.get('/posts/:id', async (ctx, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const post = await Post.findById(id)
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  ctx.body = { post: post.toObject() }
}))

app.use(route.get('/posts/:id/stargazers', async (ctx, id) => {
  const [limit, skip] = await getLimitAndSkip(ctx)
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const likes = await PostLike.find({
    post: id
  }).skip(skip).limit(limit).select({
    user: 1
  }).populate('user')
  if (!likes) ctx.throw(404, 'there are no stargazers to the post has given ID.')
  const stargazers = []
  likes.forEach(like => { stargazers.push(like.user.toObject()) })
  ctx.body = { stargazers }
}))
