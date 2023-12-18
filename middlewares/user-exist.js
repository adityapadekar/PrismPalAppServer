// Importing models
const User = require("../models/user");

// Importing error classes
const { NotFoundError } = require("../errors");

/**
 * Middleware to Check if user exists.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {NotFoundError} - If no account is found with the given email.
 */
module.exports.userExist = async (req, res, next) => {
    const { userId } = req.credentials;

    // Find the user by email
    const user = await User.findById(userId).select("-password");

    // Throw an error if no user found
    if (!user) {
        throw new NotFoundError("No account with this email");
    }

    // Add the user to the request object
    req.user = user;

    // Call the next middleware
    next();
};
