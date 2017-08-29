import mongoose from 'mongoose'
const Schema = mongoose.Schema
import mongooseAutoIncrement from 'mongoose-auto-increment'

export const schema = new Schema({
	app: {
		type: Schema.Types.ObjectId,
		required: false,
		default: null,
		ref: 'Application' },
	content: {
		type: Schema.Types.Mixed,
		required: false,
		default: {} },
	createdAt: {
		type: Date,
		required: true,
		default: Date.now },
	cursor: {
		type: Number },
	isRead: {
		type: Boolean,
		required: false,
		default: false },
	type: {
		type: String,
		required: true },
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User' }
})

export default db => {
	mongooseAutoIncrement.initialize(db)
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Notification',
		field: 'cursor'
	})
	return db.model('Notification', schema, 'Notifications')
}
