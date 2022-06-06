const mongoose = require("mongoose");

// TODO: add replies to the comments (Nested or embedded)
const commentSchema = new mongoose.Schema({
	comment: {
		type: String,
		required: true
	},
	likes:{
		type: Number,
		default: 0,
	},
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;


