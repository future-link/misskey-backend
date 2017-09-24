import route from 'koa-route'
import mongoose from 'mongoose'

import app from '../app'
import { File } from '../../db'
import { transformFile } from '../../transformers'

app.use(route.get('/files/:id', async (ctx, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no files has given ID.')
  const file = await File.findById(id)
  if (!file) ctx.throw(404, 'there are no files has given ID.')
  ctx.body = { file: await transformFile(file) }
}))
