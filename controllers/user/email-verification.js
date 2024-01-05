// Importing packages
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// Importing models
const User = require("../../models/user");
const EmailVerificationToken = require("../../models/email-verification");

// Importing error classes
const { NotFoundError, BadRequestError } = require("../../errors");

/**
 * Verify user email
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @throws {NotFoundError} - If user is not found or email verification token is not found
 * @throws {BadRequestError} - If token is invalid or user is already verified
 */
module.exports.userEmailVerification = async (req, res) => {
    // Extract the id and token from the request
    const { token } = req.params;

    // Check if token are provided
    if (!token) {
        throw new BadRequestError("Please provide token");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by id
    const user = await User.findById(decodedToken.id);

    // Throw an error if user is not found
    if (!user) {
        throw new NotFoundError("User not found");
    }

    // Find the email verification token for the user
    const emailVerificationToken = await EmailVerificationToken.findOne({
        userId: user._id,
    });

    // Throw an error if email verification token is not found
    if (!emailVerificationToken) {
        throw new NotFoundError(
            "Email verification token not found! Please try again"
        );
    }

    // Throw an error if the token is invalid
    if (emailVerificationToken.hash !== decodedToken.hash) {
        throw new BadRequestError("Invalid token");
    }

    // Set the user's isVerified flag to true
    await User.updateOne({ _id: user._id }, { isVerified: true });

    // Remove the email verification token
    await emailVerificationToken.deleteOne({
        userId: user._id,
    });

    // Return the success response
    res.status(StatusCodes.OK).json({
        msg: "Email verified successfully",
        status: true,
    });
};
