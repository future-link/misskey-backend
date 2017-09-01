export default (doc, ret) => {
  ret.id = ret._id
  delete ret.id
  delete ret.__v
}
