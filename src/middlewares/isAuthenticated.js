const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user.model");

const isAuthenticated = async (req, res, next) => {
    // Token
    if (!req.headers.authorization) {
        req.user = null;
        return next();
    };

    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) {
        req.user = null;
        return next();
    }

    try {
        const decodedToken = await promisify(jwt.verify)(
            accessToken,
            process.env.JWT_SECRET
        );
        const user = await User.findById(decodedToken.userId);
        req.user = user;
        next();
    } catch (err) {
        console.log(err.message);
        req.user = null;
        next();
    };
};

module.exports = isAuthenticated;

