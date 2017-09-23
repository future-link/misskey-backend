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
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const [limit, skip] = await getLimitAndSkip(ctx)
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

app.use(route.delete('/account/posts/:id', async (ctx, id) => {
  await denyNonAuthorized(ctx)
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const post = await Post.findById(id)
  if (!post || post.user !== ctx.state.account.id) ctx.throw(404, 'there are no posts has given ID.')
  await post.remove()
  ctx.status = 204
}))

app.use(route.put('/account/stars/:id', async (ctx, id) => {
  await denyNonAuthorized(ctx)
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const post = await Post.findById(id)
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  const content = {
    post: post.id,
    user: ctx.state.account.id }
  if (await PostLike.findOne(content)) ctx.throw(409, 'already starred.')
  const star = new PostLike(content)
  await star.save()
  ctx.status = 204
}))

app.use(route.delete('/account/stars/:id', async (ctx, id) => {
  await denyNonAuthorized(ctx)
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const post = await Post.findById(id)
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  const star = await PostLike.findOne({
    post: post.id,
    user: ctx.state.account.id })
  if (!star) ctx.throw(404, 'there are no stars to the post has given ID.')
  await star.remove()
  ctx.status = 204
}))
