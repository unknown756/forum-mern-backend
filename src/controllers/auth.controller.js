const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const AppError = require("../utils/AppError");
const { promisify } = require("util");
const sanitizeInputs = require("../utils/sanitizer");

const createToken = (userId) => jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES  }
)
const sendResponse = (res, user, statusCode) => {
    const token = createToken(user._id);
    res.cookie("cu",token);
    return res.status(statusCode).json({
        responseStatus: "success",
        token,
        user
    });
};


exports.signup = asyncErrorHandler(
    async(req, res, next) => {
        console.log(req.body);
        const {
            name,
            email,
            password,
            confirmPassword
        } = sanitizeInputs(req.body);

        const newUser = await User({
            name,
            email,
            password,
            confirmPassword,
            createdAt: Date.now(),
        });
        await newUser.save();
        newUser.password = undefined;
        newUser.__v = undefined;
        sendResponse(res, newUser, 201);
});

exports.login = asyncErrorHandler(
    async(req, res, next) => {
        const { email, password } = sanitizeInputs(req.body);
        
        // Finding User
        const user = await User.findOne({ 
            email,
            active: true 
        }).select("+password");

        // If user not found return error
        if (
            user == null || 
            (!await user.checkPassword(password, user.password))
        ) return next(
            new AppError("Bad email or password",400)
        );
        user.password = undefined;
        user.createdAt = undefined;
        sendResponse(res, user, 200);
});

exports.protect = asyncErrorHandler(
    async(req, res, next) => {
        // Authorization header  with a token
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        
        if (!token) {
            console.log("Token missing");
            return next(
                new AppError("You must login first.",401)
            );
        }
        // Validate the token
        const validToken = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET,
        );

        // User exists or not
        const user = await User.findOne({
            _id: validToken.userId, 
            active: true
        });
        if (user == null) return next(
            new AppError("User not found!",404)
        );

        // TODO:Jwt was issued before the password reset or not
        req.user = user;
        next();
});

exports.refreshToken = asyncErrorHandler(
   async(req, res, next)=>{
        if (!req.headers.cookie) {
            return res.status(400).end();
        };

        const token = req.headers.cookie.split("=")[1];

        try {
            const decodedToken = await promisify(jwt.verify)(
                token,
                process.env.JWT_SECRET
            );

            const user = await User.findById(decodedToken.userId);
            if (!user) return res.status(400).end();
            sendResponse(res, user, 200);

        } catch(err) {
            console.log(err);
            return res.status(400).end();
        }
});
