const Forum = require("../models/forum.model");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const AppError = require("../utils/AppError");
const createSlug = require("../utils/slugifyService");
const sendResponse = require("../utils/sendResponse");
const sanitizeInputs = require("../utils/sanitizer");

exports.getAllForums = asyncErrorHandler(async(req, res, next) => {
	const forums = await Forum.find(
		{ active:true }
	).populate({
        path:"owner", select:"firstName lastName profilePicture"  
    }).sort("-createdAt");
	const data = {
        user: req.user,
		results: forums.length,
		forums
	}
	sendResponse(res, 200, data) ;
});
exports.getForum = asyncErrorHandler(async(req, res, next) => {
	const forum = await Forum.findOne(
		{ slug: req.params.slug, active: true }
	).populate({
        path:"owner", select: "firstName lastName profilePicture"
    });
    if (forum == null) return next(
		new AppError("Forum not found!", 404)
	);
	sendResponse(res, 200, forum); 
});
exports.createForum = asyncErrorHandler(async(req, res, next) => {
	// Destructing the required fields. 
    const { question, description, category } = sanitizeInputs(req.body)
    
    // Creating and saving the new forum.
	const slug = await createSlug(question);
	const newForum = new Forum({
	 	question,  
		description,
        category,
		slug,
		createdAt: Date.now(),
        owner: req.user._id
	});

    await newForum.save();
    newForum.owner = undefined;
	newForum.active = undefined;
	sendResponse(res, 201, newForum); 
});
exports.editForum = asyncErrorHandler(async(req, res, next) => {
    // Fetch the forum
    const { description } = sanitizeInputs(req.body);
    const forum = await Forum.findOneAndUpdate(
        {
            _id: req.params.id,
            owner: req.user._id,
            active: true,
        },
        {
            description
        },
        {
            runValidators: true, new: true
        }
    );
    if (forum == null) return next(
        new AppError("Forum not found!",404)
    );
    sendResponse(res, 200, forum);
});
exports.deleteForum = asyncErrorHandler(async(req, res, next) => {
	const deletedForum = await Forum.findOneAndUpdate(
        {
            _id: req.params.id,
            owner: req.user._id,
            active: true,
        },
        {
            active: false
        },
    );
    if (deletedForum == null) return next(
        new AppError("Forum not found!",404)
    );
	sendResponse(res, 204, null); 
});

// FEATURES LEFT
/* Search with filters
 * Better error handling
 * Performance
 * Pagination
 * Voting and commenting with socketio
 */


