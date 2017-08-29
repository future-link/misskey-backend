import mongoose from 'mongoose'
const Schema = mongoose.Schema
import mongooseAutoIncrement from 'mongoose-auto-increment'

export const schema = new Schema({
	createdAt: {
		type: Date,
		required: true,
		default: Date.now },
	cursor: {
		type: Number },
	post: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Post' },
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User' }
})

export default db => {
	mongooseAutoIncrement.initialize(db)
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'PostLike',
		field: 'cursor'
	})
	return db.model('PostLike', schema, 'PostLikes')
}
