/**
 * @module userSchema
 * @description Schema for the User model
 */

// Importing packages
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Importing error class
const { InternalServerError } = require("../errors");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide name"],
    },
    username: {
        type: String,
        trim: true,
        required: [true, "Please provide username"],
        unique: true,
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Please provide email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide valid email",
        ],
        unique: true,
    },
    profilePicture: {
        type: {
            url: {
                type: String,
                trim: true,
                default:
                    "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
            },
            publicId: {
                type: String,
                trim: true,
                default: "default/anonymous-avatar-icon-25",
            },
        },
        required: [true, "Please provide profile picture"],
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
});

// Hasing password before saving
UserSchema.pre("save", async function (next) {
    // Generate a salt for password hashing
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);

    // Call the next middleware function
    next();
});

/**
 * Generates a JSON Web Token (JWT) for the user.
 * @returns {string} The generated JWT.
 */
UserSchema.methods.createJWT = function () {
    // Check if the JWT_STRING and JWT_LIFETIME environment variables are set
    if (!process.env.JWT_STRING || !process.env.JWT_LIFETIME) {
        throw new InternalServerError("JWT configuration is missing.");
    }

    // Generate the JWT using the user's ID, name, and email as payload
    return jwt.sign(
        {
            userId: this._id,
            name: this.username,
            email: this.email,
        },
        process.env.JWT_STRING,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};

/**
 *  Check if the provided password matches the user's password
 *  @returns {boolean} true if the passwords match, false otherwise
 */
UserSchema.methods.checkPassword = async function (candidatePassword) {
    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(candidatePassword, this.password);

    // Return the result of the comparison
    return isMatch;
};

// Create and export the User model
module.exports = mongoose.model("User", UserSchema);
