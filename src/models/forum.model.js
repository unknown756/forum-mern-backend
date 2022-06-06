const mongoose = require("mongoose");
const Comment = require("./comment.model.js");
const validator = require("validator");

const forumSchema = new mongoose.Schema({
	question: {
		type: String,
		required: [true, "A question cannot be empty."],
		minlength: [10, "Question should be 10 characters long."],
        maxlength: [100, "Question cannot be longer than 100 characters"],
        validate: {
            validator: function(value) {
                const regex = /^[a-zA-Z0-9? ]*$/;
                return validator.matches(value, regex)
            },
            message: "Question should only contain letters and numbers"
        }
	},
	description: {
		type: String,
		required: [true, "Decription cannot be empty."],
		minlength: [20, "Description should be atleast 20 characters."],
        maxlength: [1000, "Description cannot be longer than 1000 characters."],
        validate: {
            validator: function(value) {
                const regex = /^[a-zA-Z0-9? ]*$/;
                return validator.matches(value, regex)
            },
            message: "Decription should only contain letters and numbers"
        }
	},
	category: {
		type: String,
        enum: {
            values: [
                "general", 
                "self-help", 
                "health",
                "religion",
                "linguistics", 
                "relationships",
                "programming"
            ],
            message: "Category not allowed!"
	    }
    },
	comments:[
		{ 
			type: mongoose.Schema.Types.ObjectId, 
			ref:"Comment",
			default: [],
		}
	],
	likes: {
		type: Number,
		default: 0,
	},
	slug: String,
	createdAt: Date,
	active: {
		type: Boolean,
		default: true,
		select: false,
	},
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    } 
});


const Forum = mongoose.model("Forum", forumSchema);
module.exports = Forum;

