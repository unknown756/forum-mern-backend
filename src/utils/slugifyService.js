const slugify = require("slugify");
const Forum = require("../models/forum.model");

const createSlug = async(question) => {
	// Check if slug exists
    if (
        question == null || 
        question == undefined
    ) return null;

	const slug = slugify(question)
	const existingSlugs = await Forum.find({ slug: { $regex: slug }, active:true }).sort("-createdAt");
	
	// If not, create the slug
	if (existingSlugs.length == 0){
		return slug
	}
	let count = existingSlugs[0].slug.split("-").at(-1);
	const regExp = /[0-9]/;
	if (regExp.test(count)) {
		count = Number(count) + 1;
		const modifiedQues = question + " " + String(count);
		const newSlug = slugify(modifiedQues);
		return newSlug;
	}

	const modifiedQues = question + " " + "1";
	const newSlug = slugify(modifiedQues)
	return newSlug;

};

module.exports = createSlug;

