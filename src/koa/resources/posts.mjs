import Router from 'koa-router'
import mongoose from 'mongoose'

import { Post, PostLike } from '../../db/mongodb'

import { transformPost, transformAccount } from '../../transformers'
import { validateAndCastLimitAndSkip } from '../middlewares'

const router = new Router()

router.get('/', validateAndCastLimitAndSkip(), async ctx => {
  const { limit, skip } = ctx.state.query
  const posts = await Post.find().ne('type', 'repost').skip(skip).limit(limit)
  ctx.body = { posts: await Promise.all(posts.map(v => transformPost(v))) }
})

router.get('/:id', async ctx => {
  const { id } = ctx.params
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const post = await Post.findById(id)
  if (!post) ctx.throw(404, 'there are no posts has given ID.')
  if (['repost'].includes(post.type)) ctx.throw(404, 'there are no posts has given ID.')
  ctx.body = { post: await transformPost(post) }
})

router.get('/:id/stargazers', validateAndCastLimitAndSkip(), async ctx => {
  const { limit, skip } = ctx.state.query
  const { id } = ctx.params
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no posts has given ID.')
  const likes = await PostLike.find({
    post: id
  }).ne('type', 'repost').skip(skip).limit(limit).select({
    user: 1
  }).populate('user')
  if (!likes) ctx.throw(404, 'there are no stargazers to the post has given ID.')
  const stargazers = []
  likes.forEach(like => { stargazers.push(like.user) })
  ctx.body = { stargazers: await Promise.all(stargazers.map(v => transformAccount(v))) }
})

export { router as posts }
