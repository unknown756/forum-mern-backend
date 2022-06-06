const User = require("../models/user.model");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const sendResponse = require("../utils/sendResponse");

exports.getMyForums = asyncErrorHandler(async(req, res, next) => {
    const myForums = await Forum.find({
        active: true,
        owner: req.user._id
    });
    sendResponse(res, 200, myForums);
});
exports.getUser = asyncErrorHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if (user == null) return next(
        new AppError("No user found!",404)
    );
    sendResponse(res, 200, user)
});
exports.updateMe = asyncErrorHandler(async(req, res, next) => {
    // Filter the req.body object
    // Name, Email
    // Update
    // Send response
    sendResponse(res, 400, "Not implemented yet.");
});
exports.deleteAccount = asyncErrorHandler(async(req, res, next) => {
    // Send response
    sendResponse(res, 400, "Not implemented yet.");
});
