const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        {
            userId: this._id,
            name: this.username,
            email: this.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};

UserSchema.methods.checkPassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
