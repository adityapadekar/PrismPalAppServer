// Importing packages
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

// Importing models
const User = require("../../models/user");
const ForgotPasswordOtp = require("../../models/forgot-password");

// Importing error classes
const { NotFoundError, BadRequestError } = require("../../errors");

/**
 * Forgot Password Situation: Resets the password for a user by email.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {NotFoundError} If no account is found with the given email.
 * @throws {BadRequestError} If unable to reset password or OTP is not verified.
 */
module.exports.userForgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    // Check if email and newPassword are provided
    if (!email || !newPassword) {
        throw new BadRequestError(
            "Please provide required fields: email, newPassword"
        );
    }
    // Find the user by email
    const user = await User.findOne({ email: email });

    // Throw an error if no user found
    if (!user) {
        throw new NotFoundError("No account with this email");
    }

    // Find the reset password entry for the user
    const forgotPasswordEntry = await ForgotPasswordOtp.findOne({
        userId: user._id,
    });

    // Throw an error if reset password entry not found
    if (!forgotPasswordEntry) {
        throw new BadRequestError("Unable to reset password");
    }

    // Check if OTP is verified
    if (!forgotPasswordEntry.isVerified) {
        throw new BadRequestError("OTP is not verified");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        { new: true }
    );

    // Throw an error if unable to reset password
    if (!updatedUser) {
        throw new BadRequestError("Unable to reset password");
    }

    // Delete the reset password entry
    await ForgotPasswordOtp.findOneAndDelete({
        userId: user._id,
    });

    // Return success response
    return res.status(StatusCodes.OK).json({
        msg: "Password reset successfully",
        status: true,
    });
};
