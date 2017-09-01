const transform = (doc, ret) => {
  ret.id = ret._id
  delete ret.id
  delete ret.__v
}

const commonSchemaOption = {
  toObject: {
    transform
  }
}

export default transform
export { commonSchemaOption }
