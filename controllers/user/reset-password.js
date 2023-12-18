// Importing packages
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

// Importing models
const User = require("../../models/user");

// Importing error classes
const { BadRequestError } = require("../../errors");

/**
 * Resets the password for a user by email.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @throws {BadRequestError} If unable to reset password
 */
module.exports.userResetPassword = async (req, res) => {
    const { newPassword, oldPassword } = req.body;
    const user = req.user;

    // Check if  newPassword, and oldPassword are provided
    if (!newPassword || !oldPassword) {
        throw new BadRequestError(
            "Please provide required fields:  newPassword, oldPassword"
        );
    }

    // Check if old password is correct
    if (!user.checkPassword(oldPassword)) {
        throw new BadRequestError("Old password is incorrect");
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

    // Return success response
    return res.status(StatusCodes.OK).json({
        msg: "Password reset successfully",
        status: true,
    });
};
