/**
 * @module ForgotPasswordOtpSchema
 * @description Schema for the Storing OTP for password reset functionality
 */

// Importing packages
const mongoose = require("mongoose");

// Define the ForgotPasswordOtpSchema for password reset functionality
const ForgotPasswordOtpSchema = new mongoose.Schema({
    // The ID of the user associated with the otp
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Please provide user"],
        ref: "User",
        unique: true,
    },
    // The reset password otp
    otp: {
        type: Number,
        required: [true, "Please provide token"],
    },
    // Verification status
    isVerified: {
        type: Boolean,
        default: false,
    },
    // The creation date of the token
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});

// Create and export the ForgotPasswordOtpSchema model
module.exports = mongoose.model("ForgotPasswordOtp", ForgotPasswordOtpSchema);
