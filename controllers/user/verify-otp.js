// Import packages
const { StatusCodes } = require("http-status-codes");

// Import the models
const User = require("../../models/user");
const ForgotPasswordOtp = require("../../models/forgot-password");

// Import error classes
const { NotFoundError, BadRequestError } = require("../../errors");
/**
 * Generate verify it for password reset.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @throws {NotFoundError} - If user is not found.
 * @throws {BadRequestError} - If unable to reset password or invalid OTP.
 */
module.exports.verifyOTP = async (req, res) => {
    // Extract email and otp from request body
    const { email, otp } = req.body;

    // Check if email and otp are provided
    if (!email || !otp) {
        throw new BadRequestError("Please provide required fields: email, otp");
    }

    // Find the user with the provided email
    const user = await User.findOne({ email: email });

    // If user not found, throw a NotFoundError
    if (!user) {
        throw new NotFoundError("No account with this email");
    }

    // Find the reset password entry for the user
    const forgotPasswordEntry = await ForgotPasswordOtp.findOne({
        userId: user._id,
    });

    // If reset password entry not found, throw a BadRequestError
    if (!forgotPasswordEntry) {
        throw new BadRequestError("Unable to reset password");
    }

    // Check if the provided OTP matches the one stored in forgotPasswordEntry
    if (forgotPasswordEntry.otp !== otp) {
        throw new BadRequestError("Invalid OTP");
    }

    // Set the isVerified property of forgotPasswordEntry to true
    await ForgotPasswordOtp.updateOne(
        { _id: forgotPasswordEntry._id },
        { isVerified: true }
    );

    // Return success response
    return res.status(StatusCodes.OK).json({
        msg: "Otp verified",
        status: true,
    });
};
