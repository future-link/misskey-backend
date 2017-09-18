import route from 'koa-route'
import mongoose from 'mongoose'

import app from '../app'
import { AlbumFile } from '../../db'

app.use(route.get('/media/:id', async (ctx, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) { ctx.throw(404, 'there are no media has given ID.') }
  const medium = await AlbumFile.findById(id)
  if (!medium) { ctx.throw(404, 'there are no media has given ID.') }
  ctx.body = medium.toObject()
}))
