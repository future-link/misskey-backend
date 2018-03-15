import * as Router from 'koa-router'
import * as mongoose from 'mongoose'

import { File } from '../../db/mongodb'

import { transformFile } from '../../transformers'

const router = new Router()

router.get('/:id', async ctx => {
  const { id } = ctx.params
  if (!mongoose.Types.ObjectId.isValid(id)) ctx.throw(404, 'there are no files has given ID.')
  const file = await File.findById(id)
  if (!file) ctx.throw(404, 'there are no files has given ID.')
  ctx.body = { file: await transformFile(file) }
})

export { router as files }
