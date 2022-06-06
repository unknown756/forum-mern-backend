const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "First name is required."],
        minlength: [4, "Name should be atleast 4 characters long."],
        maxlength: [30, "Name should only be 30 characters long."],
        validate: {
            validator: function(value) {
                const regex = /^[a-zA-Z ]*$/;
                return validator.matches(value, regex)
            },
            message: "Name should only contain letters."
        }

    },
    email: {
        type: String,
        required: [true, "Please provide an email."],
        unique: true,
        select: false,
        validate: [validator.isEmail, "Please provide a valid email."]
    },
    password: {
        type: String,
        requried: [true, "Please enter a password."],
        minlength: [10, "A password should be at least 10 characters."],
        select: false, 
        validate: [
            validator.isStrongPassword,
            "Weak password, use a better password."
        ]
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password."],
        validate:{
            validator: function(value) { 
                return value === this.password;
            },
            message: "Passwords do not match!.",
        }
    },
    profilePicture:  {
        type: String,
        default: "http://127.0.0.1:5000/default_user.png",
    },
    createdAt: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    passwordChangedAt: Date
});

// Hash password on creating a new account
// or updating password
userSchema.pre("save", async function(next){
    if (this.isModified("password")) {
        this.confirmPassword = undefined;
        const hashedPassword = await bcrypt.hash(this.password, 12);
        this.password = hashedPassword;
        return next();
    };
    next();  
});

// Check password (used in login route)
userSchema.methods.checkPassword = async (
    inputPassword, 
    userPasswordHash
) => {
    return await bcrypt.compare(
        inputPassword,
        userPasswordHash
    );
};

// Check if the jwt was issued before the password was changed

const User = mongoose.model("User", userSchema);
module.exports = User;

