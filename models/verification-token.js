const mongoose = require("mongoose");

const VerificationTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide user"],
        ref: "User",
        unique: true,
    },
    hash: {
        type: String,
        trim: true,
        required: [true, "Please provide token"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

module.exports = mongoose.model(
    "VerificationToken",
    VerificationTokenSchema
);
