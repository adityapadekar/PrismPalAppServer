const { UnauthorizedError } = require("../errors");

/**
 * Middleware to Check if user is verified.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {UnauthorizedError} - If user is not verified.
 */
module.exports.isVerified = async (req, res, next) => {
    const { isVerified } = req.user;

    // Throw an error if role is not moderator
    if (!isVerified) {
        throw new UnauthorizedError(
            "Not authorized to access this route! Unverified users can access this route."
        );
    }

    // Call the next middleware
    next();
};
