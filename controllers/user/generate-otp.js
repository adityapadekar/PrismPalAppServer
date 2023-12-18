// Importing packages
const { StatusCodes } = require("http-status-codes");
const otpGenerator = require("otp-generator");

// Importing models
const User = require("../../models/user");
const ForgotPasswordOtp = require("../../models/forgot-password");

// Importing error classes
const { NotFoundError, BadRequestError } = require("../../errors");

// Importing Utility functions
const { sendResetEmailMail } = require("../../utils/email");

/**
 * Generate OTP and send it to the user's email for password reset.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {NotFoundError} - If user is not found.
 * @throws {BadRequestError} - If unable to generate/save/update OTP. or no email is provided.
 */
module.exports.generateOTP = async (req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        throw new BadRequestError("Email is required");
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // Throw an error if no user found
    if (!user) {
        throw new NotFoundError("No account with this email");
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });

    // Save or update the OTP in the database
    const forgotPasswordOtp = await ForgotPasswordOtp.findOneAndUpdate(
        { userId: user._id },
        { userId: user._id, otp },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Throw an error if unable to save/update OTP
    if (!forgotPasswordOtp) {
        throw new BadRequestError("Unable to reset password");
    }

    const emailSubject = "Reset Password";
    const emailBody = `Hi, ${user.name}. Your OTP is ${otp}`;

    // Send reset password email
    await sendResetEmailMail(email, emailSubject, emailBody);

    // Return success response
    res.status(StatusCodes.OK).json({
        msg: "Otp sent",
        status: true,
    });
};
