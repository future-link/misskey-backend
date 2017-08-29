import mongoose from 'mongoose'
const Schema = mongoose.Schema
import mongooseAutoIncrement from 'mongoose-auto-increment'

const generalPostSchemaObject = {
	app: {
		type: Schema.Types.ObjectId,
		required: false,
		default: null,
		ref: 'Application' },
	createdAt: {
		type: Date,
		required: true,
		default: Date.now },
	cursor: {
		type: Number },
	isDeleted: {
		type: Boolean,
		required: false,
		default: false },
	nextPost: {
		type: Schema.Types.ObjectId,
		required: false,
		default: null,
		ref: 'Post' },
	prevPost: {
		type: Schema.Types.ObjectId,
		required: false,
		default: null,
		ref: 'Post' },
	// デフォルトは投稿タイプ毎のスキーマで追記します
	type: {
		type: String,
		required: true },
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User' }
};

// like, reply, repostが可能なタイプ向けの統合スキーマ
const nonRepostSchemaObject = Object.assign({
	likesCount: {
		type: Number,
		required: false,
		default: 0 },
	repliesCount: {
		type: Number,
		required: false,
		default: 0 },
	repostsCount: {
		type: Number,
		required: false,
		default: 0 },
	files: {
		type: [Schema.Types.ObjectId],
		required: false,
		default: null,
		ref: 'AlbumFile' },
	hashtags: {
		type: [String],
		required: false,
		default: [] },
	text: {
		type: String,
		required: false,
		default: null },
}, generalPostSchemaObject);

const enableAutoincrement = schema => {
	schema.plugin(mongooseAutoIncrement.plugin, {
		model: 'Post',
		field: 'cursor'
	})
}

export const PostSchema = new Schema(generalPostSchemaObject)
export const StatusSchema = new Schema(Object.assign({
	type: {
		type: String,
		required: true,
		default: 'status' }
}, nonRepostSchemaObject))
enableAutoincrement(StatusSchema)
export const ReplySchema = new Schema(Object.assign({
	inReplyToPost: {
		type: Schema.Types.ObjectId,
		required: false,
		default: null,
		ref: 'Post' },
	type: {
		type: String,
		required: true,
		default: 'reply' }
}, nonRepostSchemaObject));
enableAutoincrement(ReplySchema)
export const RepostSchema = new Schema(Object.assign({
	post: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Post' },
	type: {
		type: String,
		required: true,
		default: 'repost' }
}, generalPostSchemaObject));
enableAutoincrement(RepostSchema)

const post = db => db.model('Post', PostSchema, 'Posts')
const status = db => db.model('Status', StatusSchema, 'Posts')
const reply = db => db.model('Reply', schema, 'Posts')
const repost = db => db.model('Repost', RepostSchema, 'Posts')
export { post, status, reply, repost }
