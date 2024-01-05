/**
 * @module EmailVerificationTokenSchema
 * @description Schema for the Email Verification Token for Registration of User
 */

// Importing packages
const mongoose = require("mongoose");

// Define the EmailVerificationTokenSchema for Registration of User
const EmailVerificationTokenSchema = new mongoose.Schema({
    // The ID of the user associated with the token
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide user"],
        ref: "User",
        unique: true,
    },
    // The verification hash
    hash: {
        type: String,
        trim: true,
        required: [true, "Please provide token"],
    },
    // The creation date of the token
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

// Create and export the EmailVerificationToken model
module.exports = mongoose.model(
    "EmailVerificationToken",
    EmailVerificationTokenSchema
);
